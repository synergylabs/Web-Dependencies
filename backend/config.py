from io import TextIOWrapper
import time

timestr = time.strftime('%m%d-%H%M')

measurement_result_filename: str = f'./outputs/measurement-result-{timestr}'
classify_result_filename: str = f'./outputs/classify-result-{timestr}'
group_result_filename: str = f'./outputs/group-result-{timestr}'
graph_result_filename: str = f'./outputs/graph-result-{timestr}.json'
error_filename: str = f'./outputs/error-{timestr}'

measurment_result_file: TextIOWrapper = open(measurement_result_filename, 'w')
classify_result_file: TextIOWrapper = open(classify_result_filename, 'w')
group_result_file: TextIOWrapper = open(group_result_filename, 'w')
graph_result_file: TextIOWrapper = open(graph_result_filename, 'w')
error_file: TextIOWrapper = open(error_filename, 'w')

output_file = open(f'./outputs/{timestr}', 'w')
graph_file = open(f'./outputs/graphs/{timestr}.json', 'w')
graph_file_dup = open('../static-frontend/data/graphData.json', 'w')