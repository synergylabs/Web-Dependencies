import time

timestr = time.strftime('%m%d-%H%M')

output_file = open(f'./outputs/{timestr}', 'w')
graph_file = open(f'./outputs/graphs/{timestr}.json', 'w')
graph_file_dup = open('../static-frontend/data/graphData.json', 'w')