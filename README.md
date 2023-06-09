# Development Document
The web application can be accessed at https://webdependency.andrew.cmu.edu

The repo consists of the following components
  - [1. Measurments Modeule](#1-measurements-scripts)
  - [2. Web Application](#2-web-application)
  - [3. API Server](#3-box-file-server)
  
## 1. Measurement Modules
The scripts in this folder are basic setup scripts for the measurement module. The measurement module measure the third-party DNS, CDN and CA dependencies of top-10K websites given a country. The code of this measurement module is available at https://github.com/AqsaKashaf/Webdep.git

The general measurement workflow is the following:
1. Fetch a list of popular website from Google BigQuery given a country c as input
    1. Please follow https://cloud.google.com/bigquery/docs/reference/libraries to setup Google BigQuery client authentication
    1. We are using a custom gmail account for this project webdep.cmu@gmail.com. Please contact Yuvraj, Vyas or me for its credentials.
    1. Once credentials retrieved and stored locally, save the path to the credential file in the variable `export GOOGLE_APPLICATION_CREDENTIALS="<path_to_credentials_json>"` 
1. Measurement: retrieve service dependencies for all websites in the list returned from step 1
1. Classify: Based on the measurement results, classify if the service dependency is Private, Third-party, or unknown
1. Measure redundancy: For DNS and CDN, measure if a website is using multiple providers, for CA measure OCSP stapling.

The setup script `install-dep.sh` installs dependencies required by the measurement module repo. The setup-cron.sh script schedules the measurements and then uploads the results to a global storage, which in our case is Box (see details below).


Request access to the following if you don't have permissions:
- Box folder is available here: https://cmu.app.box.com/folder/182556826473
- The application to upload/download file is https://cmu.app.box.com/developers/console/app/1897359

To run the measurement:
1. Clone `https://github.com/AqsaKashaf/Webdep.git`
1. Install dependencies: `install-dep.sh` and `pipenv install`
1. Start Python virtual environment: `pipenv shell`
1. Run scripts: `python Webdep\<service folder>\get_<service>_details_all.py <country_code>`
    1. `country_code` is the two character code for the country, e.g. the country code for the United States is `us`



## 2. Web Application
The web application is a React frontend application. The web application may load files in this repo or call the [Box File Server](#3-box-file-server) to fetch files from CMU Box. The application uses [Material UI](https://mui.com/material-ui/getting-started/overview/) with some [Material Dashboard Components](https://www.creative-tim.com/learning-lab/react/routing-system/material-dashboard/).

- The source files for the home page is in `src/layouts/home/`. 
- The source files for region analysis, country analysis are in `src/layouts/dashboard`. 
- The source files for side nav bar are in `src/examples/Sidenav`
The soruce files for top nav bar are in `src/examples/Navbars/DashboardNavbar`

To run the application:
1. Install dependencies: `npm install`
1. Run application: `npm start`
1. The application should be available at http://localhost:8080/

## 3. Box File Server
The Box file server is a backend service written in Python [Flask](https://flask.palletsprojects.com/en/2.2.x/). It is used to fetch files from CMU Box. Currently the route `/country/<country>/service/<service>/month/<month>` is in use. It first look for requested file from directory `files`, and fetch from Box if the file doesn't exist locally. The file server is deployed at http://webdependency.andrew.cmu.edu:5000/


Request access to the following if you don't have permissions:
- Box folder is available here: https://cmu.app.box.com/folder/182556826473
- The application to upload/download file is https://cmu.app.box.com/developers/console/app/1897359

Before running the server, you will need to fetch the client secret for the application:
1. Go to https://cmu.app.box.com/developers/console/app/1897359/configuration
1. Click "Fetch Client Secret" in "OAuth 2.0 Credentials" section
1. Copy the client secret
1. Create a new file in your home directory `~/.secrets/credentials.json`
    1. Format:
        ```
        {
          "box_client": <client_secret>
        }
        ```
    1. If you create the file at another location, change the path for the `credentials_file` in the `init_client` function in `box_client.py`

To run the server:
1. Go to box file server directory: `cd box_file_server`
1. Installl dependencies in the virtual environment: `pipenv install`
1. Activate Python virtual environment `pipenv shell`
1. Run the server: `flask run`
1. The server should be available at http://localhost:5000