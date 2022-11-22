
import utils
from typing import Tuple
from constants import Ns_type, Node_type
MNAME: str = "mname"
RNAME: str = "rname"
SUBJECT_ALT_NAME: str = "subjectAltName"





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
        utils.log_error(f"build_soa \t domain {domain} soa_output {soa_output}. Error: {e}")

    return soa_dict

def match_TLD(website,ns):
   
    # print(website,ns)
    if(website.lower() == ns.lower()):
        return True

def match_nsSOA_TLD(website,ns,soa_lib):
    match = False
    try:
        soa_website_server = soa_lib[website][0]
        soa_ns_server = soa_lib[ns][0]
        soa_website_contact = soa_lib[website][1]
        soa_ns_contact = soa_lib[ns][1]

        if(website == soa_ns_server):
            match = True
        elif(website == soa_ns_contact):
            match = True
    except Exception as e:
        # print(str(e))
        e = 1
    
    return match

def match_SOA(website,ns,soa_lib):
    match = True
    # print(website,ns)
    try:
        soa_website_server = soa_lib[website][0]
        soa_ns_server = soa_lib[ns][0]
        soa_website_contact = soa_lib[website][1]
        soa_ns_contact = soa_lib[ns][1]
        if(soa_website_server != soa_ns_server):
            match = False
        if(soa_website_contact != soa_ns_contact):
            match = False
    except Exception as e:
        # print("match soa",str(e),website,ns)
        e = 1

    return match
def match_strict_TLD(website,ns):
    w_sld = tldextract.extract(website,include_psl_private_domains=True).domain
    ns_sld = tldextract.extract(ns,include_psl_private_domains=True).domain
    if(w_sld == ns_sld):
        return True

def inSAN(w,ns,sanlib):
    for san_grp in sanlib:
        # print(san_grp)
        # exit()
        if(w in san_grp and ns in san_grp):
            return True
    return False


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
        website_domain_soa_output = utils.run_subprocess(['dig', 'soa', website_domain, '+short'])
        website_domain_soa = build_soa(website_domain, website_domain_soa_output)
        website_cert = utils.get_cert((website_domain, 443),3)
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
                ns_soa_output = utils.run_subprocess(['dig', 'soa', ns_domain, '+short'])
                ns_soa = build_soa(ns_domain, ns_soa_output)

                if ns_soa and website_domain_soa:
                    ns_soa_all[ns_domain] = ns_soa
                    if website_domain_soa[MNAME] != ns_soa[MNAME]:
                        type = Ns_type.Third_Party
                        ns_third.add(ns_domain)
                        ns_soa_third.append(ns_soa)                        

            # Record ns and website domain to count concentration
            if type == Ns_type.Unknown:
                if ns_domain not in unknown_ns_website:
                    unknown_ns_website[ns_domain] = set()
                unknown_ns_website[ns_domain].add(website_domain)
            else:
                utils.log_classify_result(f"{website_domain}\t{ns_domain.rstrip('.')}\t{type.name}\n")

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
                utils.log_classify_result(f"{website_domain}\t{ns_domain.rstrip('.')}\t{Ns_type.Third_Party.name}\n") 
        else:
            for website_domain in websites:
                utils.log_classify_result(f"{website_domain}\t{ns_domain.rstrip('.')}\t{Ns_type.Unknown.name}\n")  

    return website_domain_ns_third, ns_soa_third

def get_san(website_cert: dict) -> set:
    san_set = set()
    if website_cert:
        subject_alt_name = website_cert[SUBJECT_ALT_NAME]
        for san in subject_alt_name:
            san_set.add(san[1])         

    return san_set
