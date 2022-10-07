import sys
import subprocess
from icecream import ic
import json
import tldextract
import requests
import random
import time

def main():
    input_p = sys.argv[1]
    timestr = time.strftime('%m%d-%H%M')

    input_f =  open(input_p, 'r')
    output_f = open(f'./outputs-cdn/{timestr}.json', 'w')
    output_f2 = open('output-detailed.json', 'w')
    graph_file = open(f'./outputs-cdn/graphs/{timestr}.json', 'w')
    graph_file_dup = open('../static-frontend/data/graphData.json', 'w')

    cname_chain = list(json.load(open('./cnamechain.json', 'r')))
    starting_line = int(sys.argv[2])
    lines_to_read = int (sys.argv[3])
    
    line_n = 0
    result = []
    detailed_result = []
    urls_parsed = set()
    edges = set()
    nodes = set()

    for line in input_f:
        try:
            line_n += 1
            if line_n >= starting_line + lines_to_read:
                break
            elif line_n >= starting_line:
                ic(line_n)
                try:
                    url = line.strip('\n').split(' ')[2]
                except:
                    ic("Wrong file format")
                    continue

                extract = tldextract.extract(url)
                website_sld = extract.subdomain + '.' + extract.domain + '.' + extract.suffix
                website_tld = extract.domain + '.' + extract.suffix

                if website_sld not in urls_parsed:
                    urls_parsed.add(website_sld)
                else:
                    continue
                
                server_url = 'http://localhost:8080'
                payload = json.dumps({ 'url': url })
                headers = { 'content-type': 'application/json' }
                r = requests.post(server_url, data=payload, headers=headers)
                output = r.json()
                cdn_info = { 'website': website_sld, 'CDN output': output }
                detailed_result.append(cdn_info)
                cdn_records = output.get('everything')
                if cdn_records is None:
                    continue
                
                s_cdn = set()
                for record in cdn_records:
                    cnames = record['cnames']
                    l_cnames_tld = []
                    for cn in cnames:
                        extract = tldextract.extract(cn)
                        cn_tld = extract.domain + '.' + extract.suffix
                        l_cnames_tld.append(cn_tld)

                    if any(cname_tld == website_tld for cname_tld in l_cnames_tld):
                        cdn = None
                        for cname_tld in l_cnames_tld:
                            for link in cname_chain:
                                if link[0] == ".{}".format(cname_tld):
                                    cdn = link[1]
                                    break
                            if cdn is not None:
                                s_cdn.add(cdn)
                                break
                
                l_cdn = list(s_cdn)
                if bool(l_cdn):
                    website_cdn = {'website': website_sld, 'CDNs': l_cdn}
                    result.append(website_cdn)
                    nodes.add((website_sld, 'Client'))
                    for k in l_cdn:
                        nodes.add((k, 'Provider'))
                        edges.add((k, website_sld))
    
        except subprocess.CalledProcessError as e:
                ic(str(e.output))
        except requests.exceptions.RequestException as e:
                ic(str(e))
    
    output_f.write(json.dumps(result, indent=4))
    output_f2.write(json.dumps(detailed_result, indent=4))

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
                "label": 'CDN',
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
