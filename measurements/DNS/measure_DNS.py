
# To run, `cd backend && pipenv shell; python findNS.py <input_file> <start_index> <number_of_entries>`

import sys
import time
import utils
from io import TextIOWrapper

NXDOMAIN: str = "NXDOMAIN"
SERVFAIL: str = "SERVFAIL"
NOIP: str = "NOIP"

def measure(website_list_file: TextIOWrapper, start: int=0, top_n: int=-1) -> dict:
    """Dig all websites in the list and find their name servers

    Args:
        website_list_file (TextIOWrapper): a file containing all popular websites from crux
        output_file (TextIOWrapper): a file to write output
        top_n (int, optional): only top n websites will be measured. Defaults to 1000.

    Returns:
        dict: mapping of website domain with all name servers
    """
    
    if(top_n==-1):
        top_n = len(website_list_file)

    domains = set()
    domain_ns_all = {}
    line_number = 0

    while line_number < start + top_n:
        line_number += 1
        if(line_number > start):
            line = website_list_file.readline()
            line_split = line.strip().split(',')
            website = line_split[1]
            print(f"{line_number}: {website}")
            domain = utils.get_sld_tld(website)
            if domain not in domains:
                domains.add(domain)
            else:
                continue
            resolution_failed = False
            dig_domain_output_ip = utils.run_subprocess(['dig', domain, '+short'])
            if 'NXDOMAIN' in dig_domain_output_ip:
                utils.log_ns_result(f'{domain}\t{NXDOMAIN}\n')
                utils.log_ip_result(f'{domain}\t{NXDOMAIN}\n')
                resolution_failed = True
                continue
            elif 'SERVFAIL' in dig_domain_output_ip:
                    dig_domain_8_output = utils.run_subprocess(['dig', '@8.8.8.8', domain, '+short'])
                    output_ip = str(output_ip, 'utf-8')
                    if 'NXDOMAIN' in dig_domain_8_output:
                        utils.log_ns_result(f'{domain}\t{NXDOMAIN}\n')
                        utils.log_ip_result(f'{domain}\t{NXDOMAIN}\n')
                        resolution_failed = True
                        continue
                    elif 'SERVFAIL' in dig_domain_8_output:
                        utils.log_ns_result(f'{domain}\t{SERVFAIL}\n')
                        utils.log_ip_result(f'{domain}\t{SERVFAIL}\n')
                        resolution_failed = True
                        continue
            elif(dig_domain_output_ip == ""):
                dig_domain_output_ip = utils.run_subprocess(['dig', '@8.8.8.8', domain, '+short'])
                
                
            if(dig_domain_output_ip == ""):
                utils.log_ip_result(f'{domain}\t{NOIP}\n')
                utils.log_ns_result(f'{domain}\t{NOIP}\n')
                resolution_failed = True
            else:
                list_of_ip = output_ip.split('\n')[:-1] 
                ips_domain = set([ip.rstrip(".") for ip in list_of_ip if utils.isIP(ip.rstrip("."))])
                for ip in ips_domain:
                    utils.log_ip_result(f'{domain}\t{ip}\n')
                    
            if(not resolution_failed):
                dig_domain_output_ns = utils.run_subprocess(['dig', 'ns', domain, '+short'])

                if dig_domain_output_ns == '' or "+short" in dig_domain_output_ns:
                    utils.log_ns_result(f'{domain}\t{NONS}\n')
                else:
                    list_of_ns = dig_domain_output_ns.strip().split('\n')[:-1]
                    ns_domains = [utils.get_sld_tld(ns) for ns in list_of_ns]
                    if ns_domains:
                        domain_ns_all[domain] = set(ns_domains)
                    for domain, ns_all in domain_ns_all.items():
                        ns_all_str = ','.join(ns_all)
                    utils.log_ns_result(f'{domain}\t{ns_all_str}\n')

    return domain_ns_all
