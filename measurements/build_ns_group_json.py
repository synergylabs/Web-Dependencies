import os
import sys
import subprocess
import time
import re
import json
import random
from operator import itemgetter


def main():

    input_data = open('ns_groups', 'r')
    output_json = open('./nsGroups.json', 'a')

    ns_and_group = {}
    for line in input_data:
        group_and_ns = line.strip().split(' ;;; ')
        group = group_and_ns[0]
        name_servers = group_and_ns[1].split(' ')
        for ns in name_servers:
            ns_and_group[ns] = group

    output_json.write(json.dumps(ns_and_group, indent=4))


if __name__ == "__main__":
    main()
