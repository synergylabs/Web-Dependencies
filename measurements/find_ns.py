import sys
import json
import config
import utils
from io import TextIOWrapper
from constants import Ns_type, Node_type
from typing import Tuple

NXDOMAIN: str = "NXDOMAIN"
SERVFAIL: str = "SERVFAIL"
DOMAIN: str = "domain"
MNAME: str = "mname"
RNAME: str = "rname"
SUBJECT_ALT_NAME: str = "subjectAltName"


def measure(website_list_file: TextIOWrapper, top_n: int = 1000) -> dict:
    """Dig all websites in the list and find their name servers

    Args:
        website_list_file (TextIOWrapper): a file containing all popular websites from trancolist-eu
        output_file (TextIOWrapper): a file to write output
        top_n (int, optional): only top n websites will be measured. Defaults to 1000.

    Returns:
        dict: mapping of website domain with all name servers
    """
    domains = set()
    domain_ns_all = {}

    line_number = 0
    while line_number < top_n:
        line_number += 1
        line = website_list_file.readline()
        line_split = line.strip().split(',')
        website = line_split[1]
        print(f"{line_number}: {website}")

        domain = utils.get_sld_tld(website)

        if domain not in domains:
            domains.add(domain)
        else:
            continue

        dig_domain_output = utils.run_subprocess(['dig', domain, '+short'])
        if NXDOMAIN in dig_domain_output:
            # Domain doesn't exist
            utils.log_measurement_result(f'{domain}\t{NXDOMAIN}\n')
            continue
        elif SERVFAIL in dig_domain_output:
            # No DNS query answer
            dig_domain_8_output = utils.run_subprocess(
                ['dig', '@8.8.8.8', domain, '+short'])
            if NXDOMAIN in dig_domain_8_output:
                utils.log_measurement_result(f'{domain}\t{NXDOMAIN}\n')
                continue
            elif SERVFAIL in dig_domain_8_output:
                utils.log_measurement_result(f'{domain}\t{SERVFAIL}\n')
                continue

        # Query ns
        domain_ns_output = utils.run_subprocess(
            ['dig', 'ns', '@8.8.8.8', domain, '+short'])

        if domain_ns_output == '':
            continue

        list_of_ns = domain_ns_output.strip().split('\n')[:-1]
        ns_domains = [utils.get_sld_tld(ns) for ns in list_of_ns]
        if ns_domains:
            domain_ns_all[domain] = set(ns_domains)

    for domain, ns_all in domain_ns_all.items():
        ns_all_str = ','.join(ns_all)
        utils.log_measurement_result(f'{domain}\t{ns_all_str}\n')

    return domain_ns_all


def classify(domain_ns_all: dict) -> Tuple[dict, list]:
    """Classify all ns types (private vs third party) based on
    1. sld + tld of ns and website
    2. ns in website SAN if supporting HTTPS
    3. SOA mname of ns and website
    4. ns concentration >= 50

    Args:
        domain_ns_all (dict): mapping of website domain with all name servers

    Returns:
        Tuple[dict, list]: 
            1. mapping of website domain and all third party name servers
            2. list of third party nameservers soa
    """
    website_domain_ns_third = {}
    ns_soa_all = {}
    ns_soa_third = []
    unknown_ns_website = {}

    for website_domain, ns_set in domain_ns_all.items():
        ns_third = set()
        website_domain_soa_output = utils.run_subprocess(
            ['dig', 'soa', website_domain, '+short'])
        website_domain_soa = build_soa(
            website_domain, website_domain_soa_output)
        website_cert = utils.get_cert((website_domain, 443), 3)
        website_san = get_san(website_cert)

        for ns in ns_set:
            ns_domain = utils.get_sld_tld(ns)
            type = Ns_type.Unknown

            if website_domain == ns_domain:
                # 1. sld + tld of ns and website
                type = Ns_type.Private
            elif website_san and (ns_domain in website_san or f"*.{ns_domain}" in website_san):
                # 2. ns in website SAN if supporting HTTPS
                type = Ns_type.Private
            else:
                # 3. SOA mname of ns and website
                ns_soa_output = utils.run_subprocess(
                    ['dig', 'soa', ns_domain, '+short'])
                ns_soa = build_soa(ns_domain, ns_soa_output)

                if ns_soa and website_domain_soa:
                    ns_soa_all[ns_domain] = ns_soa
                    if website_domain_soa[MNAME] != ns_soa[MNAME]:
                        type = Ns_type.Third
                        ns_third.add(ns_domain)
                        ns_soa_third.append(ns_soa)

            # Record ns and website domain to count concentration
            if type == Ns_type.Unknown:
                if ns_domain not in unknown_ns_website:
                    unknown_ns_website[ns_domain] = set()
                unknown_ns_website[ns_domain].add(website_domain)
            else:
                utils.log_classify_result(
                    f"{website_domain}\t{ns_domain.rstrip('.')}\t{type.name}\n")

        if ns_third:
            website_domain_ns_third[website_domain] = ns_third

    # 4. ns concentration >= 50
    for ns_domain, websites in unknown_ns_website.items():
        if len(websites) >= 50:
            ns_soa_third.append(ns_soa_all[ns_domain])
            for website_domain in websites:
                if website_domain not in website_domain_ns_third:
                    website_domain_ns_third[website_domain] = set()
                website_domain_ns_third[website_domain].add(ns_domain)
                utils.log_classify_result(
                    f"{website_domain}\t{ns_domain.rstrip('.')}\t{Ns_type.Third.name}\n")
        else:
            for website_domain in websites:
                utils.log_classify_result(
                    f"{website_domain}\t{ns_domain.rstrip('.')}\t{Ns_type.Unknown.name}\n")

    return website_domain_ns_third, ns_soa_third


def get_san(website_cert: dict) -> set:
    san_set = set()
    if website_cert:
        subject_alt_name = website_cert[SUBJECT_ALT_NAME]
        for san in subject_alt_name:
            san_set.add(san[1])

    return san_set


def get_existing_ns_groups():
    """Retrive existing groups of name servers"""

    ns_and_group = {}
    ns_groups_file = open('ns_groups', 'r')
    for line in ns_groups_file:
        group_and_ns = line.strip().split(' ;;; ')
        group = group_and_ns[0]
        name_servers = group_and_ns[1].split(' ')
        for ns in name_servers:
            ns_and_group[ns] = group

    return ns_and_group


def group(website_domain_ns_third: dict, ns_soa_third: list) -> dict:
    """Group third party nameservers based on their
        1. second level domain + top level domain
        2. mname in soa
        3. rname in soa

    Args:
        website_domain_ns_third (dict): mapping of website domain and all third party nameservers
        ns_soa_third (list): list of third party nameserver soa

    Returns:
        dict: mapping of website domains and their third party nameservers group name
    """
    existing_ns_groups = get_existing_ns_groups()
    ns_group = {}
    website_domain_ns_third_group = {}

    for i in range(len(ns_soa_third)):
        ns_soa_third_1 = ns_soa_third[i]
        ns_domain_1 = ns_soa_third_1[DOMAIN]

        if ns_domain_1 not in ns_group:
            if ns_domain_1 in existing_ns_groups:
                ns_group[ns_domain_1] = existing_ns_groups[ns_domain_1]
            else:
                ns_group[ns_domain_1] = ns_domain_1

            for j in range(i+1, len(ns_soa_third)):
                ns_soa_third_2 = ns_soa_third[j]
                ns_domain_2 = ns_soa_third_2[DOMAIN]

                if ns_domain_2 not in ns_group:
                    if ns_domain_2 in existing_ns_groups:
                        ns_group[ns_domain_2] = existing_ns_groups[ns_domain_2]
                    else:
                        ns_group[ns_domain_2] = ns_domain_2

                        # Group ns based on sld+tld, mname, and rname
                        if ns_domain_1 == ns_domain_2 or \
                                ns_soa_third_1[MNAME] == ns_soa_third_2[MNAME] or \
                                ns_soa_third_1[RNAME] == ns_soa_third_2[RNAME]:
                            ns_group[ns_domain_2] = ns_group[ns_domain_1]

    for website_domain, ns_third in website_domain_ns_third.items():
        ns_third_set = set()
        for ns in ns_third:
            ns_third_set.add(ns_group[ns])
        website_domain_ns_third_group[website_domain] = ns_third_set
        ns_third_set_str = ','.join(list(ns_third_set))
        utils.log_group_result(f"{website_domain}\t{ns_third_set_str}\n")

    return website_domain_ns_third_group


def build_soa(domain: str, soa_output: str) -> dict:
    """Build an soa dict from dig soa output

    Args:
        domain (str): domain url
        soa_output (str): soa output from dig

    Returns:
        dict: soa dict with domain, mname, rname
    """
    soa_dict = {}

    try:
        if soa_output:
            soa_output_list = soa_output.strip().split(' ')
            soa_dict = {
                'domain': domain,
                'mname': utils.get_sld_tld(soa_output_list[0]),
                'rname': utils.get_sld_tld(soa_output_list[1]),
            }
    except Exception as e:
        utils.log_error(
            f"build_soa \t domain {domain} soa_output {soa_output}. Error: {e}")

    return soa_dict


def build_graph(domain_ns_third: dict) -> object:
    links = set()
    nodes = set()
    link_count = {}

    for domain, ns_third in domain_ns_third.items():
        nodes.add((domain, Node_type.Client.name))
        domain_and_type = utils.build_node_and_type(
            domain, Node_type.Client.name)
        if domain_and_type not in link_count:
            link_count[domain_and_type] = 0
        for ns in ns_third:
            nodes.add((ns, Node_type.Provider.name))
            links.add((ns, domain))
            ns_and_type = utils.build_node_and_type(
                ns, Node_type.Provider.name)

            if ns_and_type not in link_count:
                link_count[ns_and_type] = 0

            link_count[ns_and_type] += 1
            link_count[domain_and_type] += 1

    n_map = {}
    nodes = list(nodes)
    if nodes:
        id_increment = 1
        for i, n in enumerate(nodes):
            n_id = f'n{str(id_increment)}'
            label = str(n[0])
            nodeType = str(n[1])
            n_and_type = utils.build_node_and_type(label, nodeType)
            count = 1 if n_and_type not in link_count else link_count[n_and_type]
            val = 1 if nodeType == Node_type.Client.name else count
            nodes[i] = {
                'id': n_id,
                'label': label,
                'nodeType': nodeType,
                'val': val,
                'count': count
            }

            n_map[n] = n_id
            id_increment += 1

    links = list(links)
    if links:
        id_increment = 1
        for i, l in enumerate(links):
            links[i] = {
                "id": id_increment,
                "source": n_map[(l[0], Node_type.Provider.name)],
                "target": n_map[(l[1], Node_type.Client.name)],
                "label": 'DNS',
            }
            id_increment += 1

    graph = {
        'nodes': nodes,
        'links': links,
    }

    return graph


def main():
    # Path to the websites list file
    website_list_path = sys.argv[1]

    # Top n websites for measurement and analysis
    top_n = int(sys.argv[2])

    website_list_file = open(website_list_path, 'r')

    # Measure/Dig website name servers
    domain_ns_all = measure(website_list_file, top_n)
    print(domain_ns_all)
    website_domain_ns_third, ns_soa_third = classify(domain_ns_all)
    print(website_domain_ns_third)
    website_domain_ns_third_group = group(
        website_domain_ns_third, ns_soa_third)
    print(website_domain_ns_third_group)
    graph = build_graph(website_domain_ns_third_group)

    utils.log_graph_result(json.dumps(graph, indent=4))


if __name__ == "__main__":
    main()
