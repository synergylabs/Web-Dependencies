
import sys
import utils
from measure_DNS import *
from classify_DNS import *
from group_DNS import *

import json

def find_DNS_dep(website_list_path,start,top_n):
    
    website_list_file = open(website_list_path, 'r')

    # Measure/Dig website name servers
    domain_ns_all = measure(website_list_file, start, top_n)
    print(domain_ns_all)
    website_domain_ns_third, ns_soa_third = classify(domain_ns_all)
    print(website_domain_ns_third)
    website_domain_ns_third_group = group(website_domain_ns_third, ns_soa_third)
    print(website_domain_ns_third_group)
    # graph = build_graph(website_domain_ns_third_group)

    # utils.log_graph_result(json.dumps(graph, indent=4))

def main():
    # Path to the websites list file
    website_list_path = sys.argv[1]
    start = int(sys.argv[2])
    # Top n websites for measurement and analysis
    top_n = int(sys.argv[3])

    

if __name__ == "__main__":
    main()
