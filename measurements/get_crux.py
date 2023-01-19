# Before run: export GOOGLE_APPLICATION_CREDENTIALS="<path_to_credentials_json>"
# To run: python get_crux.py

from google.cloud import bigquery
import tldextract


def preprocess_crux(results):
    websites = {}
    for row in results:
        rank = row.rank
        link = row.origin
        link = tldextract.extract(link)
        domain = f"{link.domain}.{link.suffix}"
        subdomain = None
        if link.subdomain != "":
            subdomain = f"{link.subdomain}.{domain}"
        if domain not in websites:
            websites[domain] = {}
            websites[domain]["rank"] = []
            websites[domain]["subdomains"] = []
        websites[domain]["rank"].append(rank)
        if subdomain:
            websites[domain]["subdomains"].append(subdomain)
    return websites


def query_crux(country, month):
    client = bigquery.Client()
    query = f"""
        SELECT
            DISTINCT origin,experimental.popularity.rank as rank
        FROM `chrome-ux-report.country_{country}.{month}`
        ORDER BY experimental.popularity.rank ASC
        LIMIT 100000;
    """
    query_job = client.query(query)
    results = query_job.result()  # Waits for job to complete.
    return results


def extract_crux_file(crux_output_file_path, country, month):
    crux_output_file = open(crux_output_file_path, "w")
    results = query_crux(country, month)
    websites = preprocess_crux(results)

    for website, details in websites.items():
        rank = min(details["rank"])
        subdomains = ";".join(details["subdomains"])
        crux_output_file.write(f"{rank},{website},{subdomains}\n")

    crux_output_file.close()

    return len(websites)
