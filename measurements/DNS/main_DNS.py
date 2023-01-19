import utils
from .measure_DNS import measure
from .classify_DNS import classify
from .group_DNS import group
from .analyze_DNS import analyze
from .plot_DNS import plot


def print_dns_dep(output_filename, domain_rank, website_ns_type, ns_group):
    output_file = open(output_filename, "w")

    for website, rank in domain_rank.items():
        for ns, ns_type in website_ns_type[website].items():
            group = ns_group[ns] if ns in ns_group else ns
            result = f'{rank},{website},{ns},{ns_type.value},{group}\n'
            utils.log_result(output_file, result)
            # utils.log_measurement_result(result)
            print(result)


def process_dns_dep(country, month, crux_output_file_path, start, top_n):
    dns_output_filename = f'./outputs/{country}-dns-{month}'
    dns_client_stats_filename = f'./outputs/{country}-dns-{month}-client-stats'
    dns_provider_stats_filename = f'./outputs/{country}-dns-{month}-provider-stats'

    # Measure/Dig website name servers
    domain_ns_all, domain_rank = measure(crux_output_file_path, start, top_n)
    # print(domain_ns_all)

    # # Classify name servers: Pvt, Third, unknown
    website_ns_type, ns_soa_all = classify(domain_ns_all)
    # print(website_ns_type)

    # # Group name servers by provider name
    ns_group = group(ns_soa_all)
    # print(ns_group)

    # # Print group and classify result
    print_dns_dep(dns_output_filename, domain_rank, website_ns_type, ns_group)

    # Analyze client and provider stats
    analyze(month, dns_output_filename, dns_client_stats_filename, dns_provider_stats_filename)

    # Generate graph json to draw
    plot(dns_output_filename, dns_provider_stats_filename)
