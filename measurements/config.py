from io import TextIOWrapper
import time

timestr = time.strftime('%m%d-%H%M')
encoding = 'utf-8'

san_lib_filename: str = f'./lib/san-lib-{timestr}'
soa_lib_filename: str = f'./lib/soa-lib-{timestr}'
ip_result_filename: str = f'./outputs/ip-result-{timestr}'
ns_result_filename: str = f'./outputs/ns-result-{timestr}'
measurement_result_filename: str = f'./outputs/measurement-result-{timestr}'
classify_result_filename: str = f'./outputs/classify-result-{timestr}'
group_result_filename: str = f'./outputs/group-result-{timestr}'
graph_result_filename: str = f'./outputs/graph-result-{timestr}.json'
error_filename: str = f'./outputs/error-{timestr}'

ip_result_file: TextIOWrapper = open(
    ip_result_filename, 'w', encoding=encoding)
ns_result_file: TextIOWrapper = open(
    ns_result_filename, 'w', encoding=encoding)
measurment_result_file: TextIOWrapper = open(
    measurement_result_filename, 'w', encoding=encoding)
classify_result_file: TextIOWrapper = open(
    classify_result_filename, 'w', encoding=encoding)
group_result_file: TextIOWrapper = open(
    group_result_filename, 'w', encoding=encoding)
graph_result_file: TextIOWrapper = open(
    graph_result_filename, 'w', encoding=encoding)
error_file: TextIOWrapper = open(error_filename, 'w', encoding=encoding)

output_file = open(f'./outputs/{timestr}', 'w')
