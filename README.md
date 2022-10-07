# Web-Dependencies
Repo / Website for the WebDepencies project (IMC 2020) and follow ons 

- [Web Dependencies Project](#web-dependencies-project)
  - [1. To run script to collect up-to-date DNS data](#1-to-run-script-to-collect-up-to-date-dns-data)
  - [2. To run script to collect up-to-date CDN data](#2-to-run-script-to-collect-up-to-date-cdn-data)
  - [3. How to view the network graph?](#3-how-to-view-the-network-graph)
  - [4. How to interact with the CMU deployed server?](#4-how-to-interact-with-the-cmu-deployed-server)
  
## 1. To run script to collect up-to-date DNS data
1. Navigate to backend/script side of the project with `cd backend` 
2. Install project dependencies with `pipenv install`
3. Run python virtual environment with `pipenv shell`
4. Run the `findNS.py` DNS script with `python findNS.py <input_file> <start_index> <number_of_entries>`, where `input_file` is hispar's latest 100k list of URLs
5. Output from the script goes into the `./outputs` directory and the json output for graphing is copied to the visualization side of the project @ `static-frontend/data`  

## 2. To run script to collect up-to-date CDN data
1. Run `docker run -it --rm -p 8080:1337 turbobytes/cdnfinder cdnfinderserver --phantomjsbin="/bin/phantomjs"` to start the CDNFinder server
2. Navigate to backend/script side of the project with `cd backend`  
3. If not done already then install project dependencies with `pipenv install`
4. Run python virtual environment with `pipenv shell`
5. Run the `findCDN.py` CDN script with `python findCDN.py <input_file> <start_index> <number_of_entries>` , where `input_file` is hispar's latest 100k list of URLs

## 3. How to view the network graph?
1. Make sure you are in the `static-frontend` directory
2. Start a local server by using the following command `python3 -m http.server` and then browse to the URL printed to see the network graph

## 4. How to interact with the CMU deployed server?
1. Run this command in a terminal `ssh dev@webdependency.andrew.cmu.edu`
2. To copy latest data from server to local machine `scp dev@webdependency.andrew.cmu.edu:web-dependencies/backend/outputs-cdn/graphs/<file_name> /web-dependencies/frontend/src/data/`