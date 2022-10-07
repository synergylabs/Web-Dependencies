# To run, `cd backend && pipenv shell; python findNS.py <input_file> <start_index> <number_of_entries>`

import os
import sys
import subprocess
import time
import tldextract
import re
import json
import random

def extract_domain(website):
    tld = tldextract.extract(website)
    domain = tld.domain + "." + tld.suffix
    return domain

def main():

    input_path = sys.argv[1]

    timestr = time.strftime('%m%d-%H%M')
 
    input_file = open(input_path, 'r')
    output_file = open(f'./outputs/{timestr}', 'w')
    graph_file = open(f'./outputs/graphs/{timestr}.json', 'w')
    graph_file_dup = open('../static-frontend/data/graphData.json', 'w')
    
    starting_line = int(sys.argv[2])
    lines_to_read = int (sys.argv[3])

    edges = set()
    nodes = set()
    domains = set()
    
    line_number = 0
    for line in input_file:
        line_number += 1
        try:
            if line_number >= starting_line + lines_to_read:
                break
            elif line_number >= starting_line:
                print(line_number)
                try:
                    url = line.strip('\n').split(' ')[2]
                except:
                    print("Wrong file format")
                    continue

                domain = extract_domain(url)
                
                if domain not in domains:
                    domains.add(domain)
                else:
                    continue

                output = subprocess.check_output(['dig', domain, '+short'])
                output = str(output, 'utf-8')
                if 'NXDOMAIN' in output:
                    output_file.write(f'{domain}\tNXDOMAIN\n')
                    continue
                elif 'SERVFAIL' in output:
                    output = subprocess.check_output(['dig', '@8.8.8.8', domain, '+short'])
                    output = str(output, 'utf-8')
                    if 'NXDOMAIN' in output:
                        output_file.write(f'{domain}\tNXDOMAIN\n')
                        continue
                    elif 'SERVFAIL' in output:
                        output_file.write(f'{domain}\tSERVFAIL\n')
                        continue

                output = subprocess.check_output(['dig', 'ns', '@8.8.8.8', domain, '+short'])
                output = str(output, 'utf-8')

                if output == '':
                    continue

                list_of_ns = output.split('\n')[:-1]                                
                if not list_of_ns:
                    continue

                ns_third = set()
                for ns in list_of_ns:
                    ns_domain = extract_domain(ns)
                    classification = ''
                    if domain == ns_domain:
                        classification = 'Private'
                    else:                        
                        classification = 'Third-Party'
                        ns_third.add(ns_domain)

                    output_file.write(domain + "\t" + ns.rstrip('.') + "\t" + classification + "\n")

                if not ns_third:
                    continue
                
                ns_soa = []
                for ns in ns_third:
                    output = subprocess.check_output(['dig', 'soa', ns, '+short'])
                    output = str(output, 'utf-8')
                    output = output.split(' ')
                    soa = extract_domain(output[0])
                    email = extract_domain(output[1])
                    ns_soa.append({
                        'ns': ns,
                        'soa': soa,
                        'email': email,
                        'matched': False,
                    })
                
                # grouping by soa.sld
                grouped_by_soa = set()
                for i in ns_soa:
                    for j in ns_soa:
                        if i['soa'] == j['soa'] and i['ns'] != j['ns']:
                            i['matched'], j['matched'] = True, True
                            grouped_by_soa.add(i['soa'])
                
                unmatched = []
                for k in ns_soa:
                    if not k['matched']:
                        unmatched.append(k)

                # grouping by email.sld
                grouped_by_email = set()
                for i in unmatched:
                    for j in unmatched:
                        if i['email'] == j['email'] and i['ns'] != j['ns']:
                            i['matched'], j['matched'] = True, True
                            grouped_by_email.add(i['email'])
                
                # give individual groups to all unmatched
                grouped_by_sld = set()
                for i in unmatched:
                    if not i['matched']:
                        grouped_by_sld.add(i['ns'])

                all_groups = grouped_by_sld | grouped_by_email | grouped_by_soa
                nodes.add((domain, 'Client'))
                for k in all_groups:
                    nodes.add((k, 'Provider'))
                    edges.add((k, domain))

        except subprocess.CalledProcessError as e:
            print(e.output)
            pass

    n_map = {}
    if nodes:
        nodes = list(nodes)
        id_increment = 1
        for i, n in enumerate(nodes):
            n_id = f'n{str(id_increment)}'
            color = '#FFFF00'
            if n[1] == 'Provider':
                color = '#0000FF'

            nodes[i] = {
                "id": n_id,
                "label": str(n[0]),
                "color": color,
                "x": random.random(),
                "y": random.random()
            }
            
            n_map[n] = n_id
            id_increment += 1

    if edges:
        edges = list(edges)
        id_increment = 1
        for i, e in enumerate(edges):
            edges[i] = {
                "id": id_increment,
                "source": n_map[(e[0], 'Provider')],
                "target": n_map[(e[1], 'Client')],
                "label": 'DNS',
            }
            id_increment += 1

    graph_object = {
        'nodes': nodes,
        'edges': edges 
    }
    graph_file.write(json.dumps(graph_object, indent=4))
    graph_file_dup.write(json.dumps(graph_object, indent=4))

if __name__ == "__main__":
    main()
