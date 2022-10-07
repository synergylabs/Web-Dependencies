from cProfile import run
import os
import sys
import subprocess
import time
import tldextract
import re
import json
import random
from io import TextIOWrapper
from typing import Text
from utils import run_subprocess
from constants import Ns_type, Node_type


def get_domain_suffix(website: str) -> str:
    """Extract second level domain and first level domain

    Args:
        website (str): full website url

    Returns:
        str: "sld.tld"
    """
    tld = tldextract.extract(website)
    domain = f"{tld.domain}.{tld.suffix}"

    return domain

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
        print(line)

        # Get website url and domain
        url = line.strip()
        domain = get_domain_suffix(url)

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
    


            # # grouping by soa.sld
            # grouped_by_soa = set()
            # for i in ns_soa:
            #     for j in ns_soa:
            #         if i['soa'] == j['soa'] and i['ns'] != j['ns']:
            #             i['matched'], j['matched'] = True, True
            #             grouped_by_soa.add(i['soa'])

            # unmatched = []
            # for k in ns_soa:
            #     if not k['matched']:
            #         unmatched.append(k)

            # # grouping by email.sld
            # grouped_by_email = set()
            # for i in unmatched:
            #     for j in unmatched:
            #         if i['email'] == j['email'] and i['ns'] != j['ns']:
            #             i['matched'], j['matched'] = True, True
            #             grouped_by_email.add(i['email'])

            # # give individual groups to all unmatched
            # grouped_by_sld = set()
            # for i in unmatched:
            #     if not i['matched']:
            #         grouped_by_sld.add(i['ns'])

            # all_groups = grouped_by_sld | grouped_by_email | grouped_by_soa
            # nodes.add((domain, 'Client'))
            # for k in all_groups:
            #     nodes.add((k, 'Provider'))
            #     edges.add((k, domain))

    return domain_ns_all

def classify(domain_ns_all: dict) -> dict:
    """Classify all ns types (private vs third party) based on
    1. sld + tld of ns and website
    2. SAN for websites supporting HTTPS
    3. SOA mname of ns and website
    4. ns concentration >= 50

    Args:
        domain_ns_all (dict): mapping of website domain with all name servers

    Returns:
        dict: mapping of website domain and all third party name servers
    """
    domain_ns_third = {}
    ns_third_concentration = {}
    ns_third_soa = []

    for domain, ns_list in domain_ns_all.items():
        ns_third = set()
        domain_soa_output = run_subprocess(['dig', 'soa', domain, '+short'])
        domain_soa = build_soa(domain_soa_output)

        for ns in ns_list:
            ns_domain_suffix = get_domain_suffix(ns)
            ns_type = Ns_type.Unknown
            if domain == ns_domain_suffix:
                # 1. sld + tld of ns and website
                ns_type = Ns_type.Private
            else:
                # 3. SOA mname of ns and website
                ns_soa_output = run_subprocess(['dig', 'soa', ns, '+short'])
                ns_soa = build_soa(ns_soa_output)

                if not is_soa_mname_match(domain_soa_output, ns_soa_output):
                    ns_type = Ns_type.Third_Party
                    ns_third.add(ns_domain_suffix)

            output_file.write(domain + "\t" + ns.rstrip('.') + "\t" + ns_type.name + "\n")

        for nst in ns_third:
            if nst in ns_third_concentration:
                ns_third_concentration[ns].append(domain)
            else:
                ns_third_concentration[ns] = [domain]
        # if ns_third:
        #     domain_ns_third[domain] = ns_third
                
    return domain_ns_third

def build_soa(soa_output: str) -> dict:
    """Build an soa dict from dig soa output

    Args:
        soa_output (str): soa output from dig

    Returns:
        dict: soa dict with ns, rname, mname
    """
    soa_dict = {}
    if not soa_output:
        soa_output_list = soa_output.split(' ')
        soa_dict = {
            ''
        }
def is_soa_mname_match(domain_soa_output: str, ns_soa_output: str) -> bool:
    """Checks if website and ns has same mname in soa record

    Args:
        domain (str): website domain
        ns_domain_suffix (str): ns domain and suffix

    Returns:
        bool: True if website domain and ns has same mname in soa record
    """
    ns_soa = []
    for ns in ns_third:
        output = output.split(' ')
        soa = tld_extract_domain(output[0])
        email = tld_extract_domain(output[1])
        ns_soa.append({
            'ns': ns,
            'soa': soa,
            'email': email,
            'matched': False,
        })

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
    top_n = 500

    timestr = time.strftime('%m%d-%H%M')
    website_list_file = open(website_list_path, 'r')
    output_file = open(f'./outputs/{timestr}', 'w')
    graph_file = open(f'./outputs/graphs/{timestr}.json', 'w')
    graph_file_dup = open('../static-frontend/data/graphData.json', 'w')

    # Measure/Dig website name servers
    domain_ns_all = measure(website_list_file, top_n)
    domain_ns_third = classify(domain_ns_all)
    graph = build_graph(domain_ns_third)

    graph_file.write(json.dumps(graph, indent=4))
    graph_file_dup.write(json.dumps(graph, indent=4))
    print(domain_ns_third)

if __name__ == "__main__":
    main()
