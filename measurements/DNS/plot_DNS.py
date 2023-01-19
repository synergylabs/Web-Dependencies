import os
import sys
import subprocess
import time
import re
import json
import random
from operator import itemgetter
from constants import Node_type


def get_top_providers(dns_provider_stats_filename, top_n=10):
    provider_stats = open(dns_provider_stats_filename, 'r')
    top_providers = set()

    # Read header
    line = provider_stats.readline()
    i = 0
    while i < top_n:
        line = provider_stats.readline()
        line_split = line.strip().split(',')
        provider = line_split[0]
        top_providers.add(provider)
        i += 1
    provider_stats.close()

    return top_providers


def plot(dns_output_filename, dns_provider_stats_filename):
    # input_data = open(dns_output_filename, 'r')
    # output_json = open(f'{dns_output_filename}-graph.json', 'w')

    # client_indices = {}
    # provider_indices = {}
    # client_provider_links = set()
    # clients = set()
    # client_links = {}
    # nodes = []
    # links = []

    # top_providers = get_top_providers(dns_provider_stats_filename)

    # index = 0
    # for line in input_data:
    #     line_list = line.strip().split(',')
    #     client_rank = int(line_list[0])
    #     client = line_list[1]
    #     clients.add(client)
    #     if client not in client_links:
    #         client_links[client] = set()

    #     provider_type = line_list[3]
    #     provider = line_list[4]
    #     if client_rank < 100000 and provider_type == 'Third' and provider in top_providers:
    #         client_provider_link = f"{client}-{provider}"

    #         if client_provider_link in client_provider_links:
    #             continue
    #         client_links[client].add(client_provider_link)
    #         if client not in client_indices:
    #             client_indices[client] = index
    #             nodes.append({
    #                 "id": index,
    #                 "label": client,
    #                 "nodeType": Node_type.Client.value,
    #                 "val": 1
    #             })
    #             index += 1

    #         if provider not in provider_indices:
    #             provider_indices[provider] = index
    #             nodes.append({
    #                 "id": index,
    #                 "label": provider,
    #                 "nodeType": Node_type.Provider.value,
    #                 "val": 1
    #             })
    #             index += 1
    #         else:
    #             provider_index = provider_indices[provider]
    #             provider_node = nodes[provider_index]
    #             provider_node["val"] = provider_node["val"] + 1

    #         client_provider_links.add(client_provider_link)
    #         links.append({
    #             "source": provider_indices[provider],
    #             "target": client_indices[client],
    #         })

    # graph = {
    #     "nodes": nodes,
    #     "links": links,
    # }

    # nodes.sort(key=itemgetter("val"))
    # print(nodes[-5:])
    # output_json.write(json.dumps(graph, indent=4))

    # importing networkx
    import networkx as nx
    # importing matplotlib.pyplot
    import matplotlib.pyplot as plt

    g = nx.Graph()

    g.add_edge(1, 2)
    g.add_edge(2, 3)
    g.add_edge(3, 4)
    g.add_edge(1, 4)
    g.add_edge(1, 5)
    g.add_node("Cloudflare")
    # nx.draw(g, with_labels=True)
    d = dict(g.degree)

    nx.draw(g, nodelist=d.keys(), node_size=[v * 100 for v in d.values()])
    plt.savefig("filename.png")
