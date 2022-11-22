# Before run: export GOOGLE_APPLICATION_CREDENTIALS="<path_to_credentials_json>"
# To run: python get_crux.py

from utils import get_last_month
from google.cloud import bigquery
import tldextract



def preprocess_crux(results):
    websites = {}
    for row in results:
        rank = row.rank
        link = row.origin
        link = tldextract.extract(link)
        domain = link.domain + "." + link.suffix
        subdomain = None
        if(link.subdomain != ""):
            subdomain = link.subdomain + "." + domain
        if(domain not in websites):
            websites[domain] = {}
            websites[domain]["rank"] = []
            websites[domain]["subdomains"] = []
        websites[domain]["rank"].append(rank)
        if(subdomain):
            websites[domain]["subdomains"].append(subdomain)
    return websites



def query_crux():


    client = bigquery.Client()
    query = f"""
        SELECT
            DISTINCT origin,experimental.popularity.rank as rank
        FROM `chrome-ux-report.country_{country}.{last_month}`
        ORDER BY experimental.popularity.rank ASC
        LIMIT 1000000;
    """
    query_job = client.query(query)
    results = query_job.result()  # Waits for job to complete.
    return results
    


def extract_crux_file(country, month):
    crux_output_filename = f'crux-{month}'
    crux_output_file = open(f'./crux/{crux_output_filename}', 'w')
    results = query_crux(month,country)
    websites = preprocess_crux(results)
    
    for w,details in websites.items():
        rank = min(details["rank"])
        subdomains = ";".join(details["subdomains"])
        crux_output_file.write(f"{rank},{w},{subdomains}\n")

    crux_output_file.close()