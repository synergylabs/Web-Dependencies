

import get_crux
import sys
import DNS.main_DNS
import utils

def main():
    country = sys.argv[1]
    month = utils.get_last_month()
    crux_output_filename = f'crux-{month}'
    crux_output_file = open(f'./crux/{crux_output_filename}', 'w')
    get_crux.extract_crux_file(country,month)
    DNS.main_DNS.find_DNS_dep(crux_output_file)



if __name__ == "__main__":
    main()