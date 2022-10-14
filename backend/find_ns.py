from cProfile import run
import sys
import time
import re
import json
import random
from io import TextIOWrapper
from typing import Text
from utils import run_subprocess, get_sld_tld, get_cert
from constants import Ns_type, Node_type
from typing import Tuple

def measure(website_list_file: TextIOWrapper, top_n: int=1000) -> dict:
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
        print(f"{line_number}: {line}")

        # Get website url and domain
        url = line.strip()
        domain = get_sld_tld(url)

        if domain not in domains:
            domains.add(domain)
        else:
            continue

        dig_domain_output = run_subprocess(['dig', domain, '+short'])
        if 'NXDOMAIN' in dig_domain_output:
            # Domain doesn't exist
            output_file.write(f'{domain}\tNXDOMAIN\n')
            continue
        elif 'SERVFAIL' in dig_domain_output:
            # No DNS query answer
            dig_domain_8_output = run_subprocess(['dig', '@8.8.8.8', domain, '+short'])
            if 'NXDOMAIN' in dig_domain_8_output:
                output_file.write(f'{domain}\tNXDOMAIN\n')
                continue
            elif 'SERVFAIL' in dig_domain_8_output:
                output_file.write(f'{domain}\tSERVFAIL\n')
                continue
        
        # Query ns
        domain_ns_output = run_subprocess(['dig', 'ns', '@8.8.8.8', domain, '+short'])

        if domain_ns_output == '':
            continue

        list_of_ns = domain_ns_output.split('\n')[:-1]
        if list_of_ns:
            domain_ns_all[domain] = list_of_ns  

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
    ns_concentration = {}
    ns_soa_all = {}
    ns_soa_third = []

    for website_domain, ns_list in domain_ns_all.items():
        ns_third = set()
        print(f"website_domain {website_domain}")
        website_domain_soa_output = run_subprocess(['dig', 'soa', website_domain, '+short'])
        print(f"website_domain_soa_output {website_domain_soa_output}")
        website_domain_soa = build_soa(website_domain, website_domain_soa_output)
        website_cert = get_cert((website_domain, 443),3)
        
        for ns in ns_list:
            ns_domain_suffix = get_sld_tld(ns)
            print(ns_domain_suffix)
            ns_type = Ns_type.Unknown
            if website_domain == ns_domain_suffix:
                # 1. sld + tld of ns and website
                ns_type = Ns_type.Private
                output_file.write(website_domain + "\t" + ns.rstrip('.') + "\t" + ns_type.name + "\n")
            else:
                # 2. ns in website SAN if supporting HTTPS
                
                # 3. SOA mname of ns and website
                ns_soa_output = run_subprocess(['dig', 'soa', ns_domain_suffix, '+short'])
                ns_soa = build_soa(ns, ns_soa_output)
                if not ns_soa or not website_domain_soa:
                    continue

                ns_soa_all[ns] = ns_soa

                if website_domain_soa['mname'] != ns_soa['mname']:
                    ns_type = Ns_type.Third_Party
                    ns_third.add(ns)
                    ns_soa_third.append(ns_soa)

                    output_file.write(website_domain + "\t" + ns.rstrip('.') + "\t" + ns_type.name + "\n")

            # Record ns and website link to count concentration
            if ns in ns_concentration:
                ns_concentration[ns].append(website_domain)
            else:
                ns_concentration[ns] = [website_domain]

        website_domain_ns_third[website_domain] = ns_third

    # 4. ns concentration >= 50
    for ns, website_domain_list in ns_concentration.items():
        if len(website_domain_list) >= 50:
            for website_domain in website_domain_list:
                website_domain_ns_third[website_domain].add(ns)
                ns_soa_third.append(ns_soa_all[ns])

    return website_domain_ns_third, ns_soa_third

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
    matched = set()
    ns_group = {}
    website_domain_ns_third_group = {}

    for i in range(len(ns_soa_third)):
        ns_soa_third_1 = ns_soa_third[i]
        ns_1 = ns_soa_third_1['domain']
        if ns_1 not in matched:
            ns_domain_1 = get_sld_tld(ns_1)
            ns_group[ns_1] = ns_domain_1
            matched.add(ns_1)

            for j in range(len(ns_soa_third)):
                ns_soa_third_2 = ns_soa_third[j]
                ns_2 = ns_soa_third_2['domain']
                if ns_2 not in matched:
                    ns_domain_2 = get_sld_tld(ns_2)

                    # Group ns based on sld+tld, mname, and rname
                    if ns_domain_1 == ns_domain_2 or \
                        ns_soa_third_1['mname'] == ns_soa_third_2['mname'] or \
                        ns_soa_third_1['rname'] == ns_soa_third_2['rname']:
                        ns_group[ns_2] = ns_domain_1
                        matched.add(ns_2)
    
    for website_domain, ns_third_set in website_domain_ns_third.items():
        ns_third_list = []
        for ns in ns_third_set:
            ns_third_list.append(ns_group[ns])
        website_domain_ns_third_group[website_domain] = ns_third_list
    
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
            soa_output_list = soa_output.split(' ')
            soa_dict = {
                'domain': domain,
                'mname': soa_output_list[0],
                'rname': soa_output_list[1],
            }
    except Exception as e:
        output_file.write(f"build_soa \t domain {domain} soa_output {soa_output}")
        output_file.write(e)

    return soa_dict

def build_graph(domain_ns_third: dict) -> object:
    links = set()
    nodes = set()
    link_count = {}

    for domain, ns_third in domain_ns_third.items():
        nodes.add((domain, Node_type.Client.name))
        for ns in ns_third:
            nodes.add((ns, Node_type.Provider.name))
            links.add((ns, domain))
            if ns not in link_count:
                link_count[ns] = 0
            else:
                link_count[ns] += 1

    n_map = {}
    if nodes:
        nodes = list(nodes)
        id_increment = 1
        for i, n in enumerate(nodes):
            n_id = f'n{str(id_increment)}'
            label = str(n[0])
            color = '#FFFF00'
            if n[1] == 'Provider':
                color = '#0000FF'

            nodes[i] = {
                'id': n_id,
                'label': label,
                'group': str(n[1]),
                'val': 1 if label not in link_count else link_count[label]
            }
            
            n_map[n] = n_id
            id_increment += 1

    if links:
        links = list(links)
        id_increment = 1
        for i, l in enumerate(links):
            links[i] = {
                "id": id_increment,
                "source": n_map[(l[0], 'Provider')],
                "target": n_map[(l[1], 'Client')],
                "label": 'DNS',
            }
            id_increment += 1

    graph = {
        'nodes': nodes,
        'links': links,
    }

    return graph

def main():
    # Output file accessible globally
    global output_file

    # Path to the websites list file
    website_list_path = sys.argv[1]

    # Top n websites for measurement and analysis
    top_n = int(sys.argv[2])

    timestr = time.strftime('%m%d-%H%M')
    website_list_file = open(website_list_path, 'r')
    output_file = open(f'./outputs/{timestr}', 'w')
    graph_file = open(f'./outputs/graphs/{timestr}.json', 'w')
    graph_file_dup = open('../static-frontend/data/graphData.json', 'w')

    # Measure/Dig website name servers
    domain_ns_all = measure(website_list_file, top_n)
    website_domain_ns_third, ns_soa_all = classify(domain_ns_all)
    website_domain_ns_third_group = group(website_domain_ns_third, ns_soa_all)
    graph = build_graph(website_domain_ns_third_group)

    graph_file.write(json.dumps(graph, indent=4))
    graph_file_dup.write(json.dumps(graph, indent=4))


if __name__ == "__main__":
    main()
