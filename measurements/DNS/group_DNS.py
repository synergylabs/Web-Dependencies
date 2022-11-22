import utils 

DOMAIN: str = "domain"
MNAME: str = "mname"
RNAME: str = "rname"

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
