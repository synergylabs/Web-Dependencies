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


def group(ns_soa_all: list) -> dict:
    """Group third party nameservers based on their
        1. second level domain + top level domain
        2. mname in soa
        3. rname in soa

    Args:
        ns_soa_all (list): list of nameserver soa

    Returns:
        dict: nameservers and group name
    """
    existing_ns_groups = get_existing_ns_groups()
    ns_group = {}

    for i in range(len(ns_soa_all)):
        ns_soa_1 = ns_soa_all[i]
        ns_domain_1 = ns_soa_1[DOMAIN]

        if ns_domain_1 not in ns_group:
            if ns_domain_1 in existing_ns_groups:
                ns_group[ns_domain_1] = existing_ns_groups[ns_domain_1]
            else:
                ns_group[ns_domain_1] = ns_domain_1

            for j in range(i+1, len(ns_soa_all)):
                ns_soa_2 = ns_soa_all[j]
                ns_domain_2 = ns_soa_2[DOMAIN]

                if ns_domain_2 not in ns_group:
                    if ns_domain_2 in existing_ns_groups:
                        ns_group[ns_domain_2] = existing_ns_groups[ns_domain_2]
                    else:
                        ns_group[ns_domain_2] = ns_domain_2

                        # Group ns based on sld+tld, mname, and rname
                        if ns_domain_1 == ns_domain_2 or \
                                ns_soa_1[MNAME] == ns_soa_2[MNAME] or \
                                ns_soa_1[RNAME] == ns_soa_2[RNAME]:
                            ns_group[ns_domain_2] = ns_group[ns_domain_1]

    return ns_group
