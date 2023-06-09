from constants import Ns_type, Stats_type
from operator import itemgetter

K1 = '1000'
K10 = '10000'
K100 = '100000'
PROVIDER = 'provider'


def analyze(month, measurement_output_filename, dns_client_stats_filename, dns_provider_stats_filename):
    measurement_output_file = open(measurement_output_filename, 'r')
    dns_client_stats_file = open(dns_client_stats_filename, 'a')
    dns_provider_stats_file = open(dns_provider_stats_filename, 'w')

    client_third_providers = {}
    client_unknown_providers = set()
    client_private_providers = set()
    client_stats_index = {}
    client_stats = {
        K1: {
            Stats_type.Third_Only.value: 0,
            Stats_type.Critical.value: 0,
            Stats_type.Redundant.value: 0,
            Stats_type.Private_And_Third.value: 0
        },
        K10: {
            Stats_type.Third_Only.value: 0,
            Stats_type.Critical.value: 0,
            Stats_type.Redundant.value: 0,
            Stats_type.Private_And_Third.value: 0
        },
        K100: {
            Stats_type.Third_Only.value: 0,
            Stats_type.Critical.value: 0,
            Stats_type.Redundant.value: 0,
            Stats_type.Private_And_Third.value: 0
        }
    }
    provider_stats = {}
    provider_clients = {}
    rank_count = {
        K1: set(),
        K10: set(),
        K100: set(),
    }

    for line in measurement_output_file.readlines():
        line_split = line.strip().split(',')
        rank = line_split[0]
        client = line_split[1]
        provider_type = line_split[3]
        provider = line_split[4]

        if rank == K1:
            client_stats_index[client] = [K1, K10, K100]
        elif rank == K10:
            client_stats_index[client] = [K10, K100]
        elif rank == K100:
            client_stats_index[client] = [K100]

        if provider_type == Ns_type.Private.value:
            client_private_providers.add(client)
            for i in client_stats_index[client]:
                rank_count[i].add(client)
        elif provider_type == Ns_type.Unknown.value:
            client_unknown_providers.add(client)
        elif provider_type == Ns_type.Third.value:
            # Client stats
            for i in client_stats_index[client]:
                rank_count[i].add(client)
            if client not in client_third_providers:
                client_third_providers[client] = set()
            client_third_providers[client].add(provider)

            # Link clients and provider
            if provider not in provider_clients:
                provider_clients[provider] = set()
            provider_clients[provider].add(client)

    for client in client_unknown_providers:
        client_private_providers.discard(client)
        for i in client_stats_index[client]:
            rank_count[i].discard(client)

    for client in rank_count[K100]:
        stats_to_add = []
        if client in client_private_providers and client in client_third_providers:
            stats_to_add.append(Stats_type.Redundant)
            stats_to_add.append(Stats_type.Private_And_Third)
        elif client in client_third_providers:
            stats_to_add.append(Stats_type.Third_Only)
            if len(client_third_providers[client]) > 1:
                stats_to_add.append(Stats_type.Redundant)
            else:
                stats_to_add.append(Stats_type.Critical)

                # Compute Impact
                for provider in client_third_providers[client]:
                    if provider not in provider_stats:
                        provider_stats[provider] = {
                            PROVIDER: provider,
                            Stats_type.Concentration.value: len(provider_clients[provider]),
                            Stats_type.Impact.value: 0,
                        }
                    provider_stats[provider][Stats_type.Impact.value] += 1

        for i in client_stats_index[client]:
            for s in stats_to_add:
                client_stats[i][s.value] += 1.0/len(rank_count[i])

    print(provider_stats)
    all_provider_stats = [ps for _, ps in provider_stats.items()]
    print(all_provider_stats)
    all_provider_stats_sorted = sorted(
        all_provider_stats, key=lambda ps: ps[Stats_type.Concentration.value], reverse=True)
    print(all_provider_stats_sorted)
    dns_provider_stats_file.write(
        f'{PROVIDER},{Stats_type.Concentration.value},{Stats_type.Impact.value}\n')
    for apss in all_provider_stats_sorted:
        stat = f'{apss[PROVIDER]},{apss[Stats_type.Concentration.value]},{apss[Stats_type.Impact.value]}\n'
        dns_provider_stats_file.write(stat)

    dns_client_stats_file.write(
        f'month,rank,{Stats_type.Third_Only.value},{Stats_type.Critical.value},{Stats_type.Redundant.value},{Stats_type.Private_And_Third.value}\n')
    for rank, cs in client_stats.items():
        stat = f'{month},{rank},{cs[Stats_type.Third_Only.value]},{cs[Stats_type.Critical.value]},{cs[Stats_type.Redundant.value]},{cs[Stats_type.Private_And_Third.value]}\n'
        dns_client_stats_file.write(stat)
