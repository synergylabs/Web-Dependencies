# Before run: export GOOGLE_APPLICATION_CREDENTIALS="<path_to_credentials_json>"
# To run: python get_crux.py

from utils import get_last_month
from google.cloud import bigquery

def query_crux():
    last_month = get_last_month()
    country = 'us'
    crux_output_filename = f'crux-{last_month}'
    crux_output_file = open(f'./crux/{crux_output_filename}', 'w')

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

    for row in results:
        crux_output_file.write(f'{row.rank},{row.origin}\n')


if __name__ == "__main__":
    query_crux()