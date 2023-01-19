# python main.py <country_code>

import sys
import get_crux
import DNS.main_DNS

import utils


def main():
    country = sys.argv[1]
    month = '202210'
    crux_output_filename = f'crux-{month}'
    crux_output_file_path = f'./crux/{crux_output_filename}'

    # # # Retrieve crux website list from Google BigQuery
    # Need client credentials
    # total = get_crux.extract_crux_file(crux_output_file_path, country, month)

    # #
    start = 0
    top_n = 0

    DNS.main_DNS.process_dns_dep(country, month, crux_output_file_path, start, top_n)


if __name__ == "__main__":
    main()
