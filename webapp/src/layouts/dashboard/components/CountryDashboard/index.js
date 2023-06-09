/* eslint-disable prettier/prettier */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState, useRef } from "react";
import { useEffect } from "react";
import React from "react";

import Collapse from "@mui/material/Collapse";




// @mui material components
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";


// Dashboard components
import Graph from "layouts/dashboard/components/DependencyGraph/Graph";
import Search from "layouts/dashboard/components/DependencyGraph/Search";
import { getDnsGraphStats, getCdnGraphStats, getCaGraphStats } from "../CountryDashboard/graphStatsHelper"
import {createTable } from "../CountryDashboard/tableHelper"
// import {showGraph } from "../CountryDashboard/graph"
import raw from "data/cdn_dns";

// const data_ready = new Set([])
const cache = {}
const top_n = 5;
// const api_address = "http://localhost";

const getTop5Providers = (nodes) => {
  nodes = nodes.filter((n) => n.nodeType === "Provider").sort((n1, n2) => n2.conc.size - n1.conc.size);
  return nodes.slice(0, top_n);
};

const getTop5ProvidersByConcentration = (providers) => {
  providers = providers.sort((p1, p2) => p2.concentration - p1.concentration);
  return providers.slice(0, top_n);
}
const getGraphStats = (text, service) => {
  if (service === "dns") {
    return getDnsGraphStats(text);
  } else if (service === "cdn") {
    return getCdnGraphStats(text);
  } else {
    return getCaGraphStats(text);
  }
}

function getPercentage(value, total) {
  console.log(value, total)
  return Math.round(100*value/total);
}



function parseProviderStats(providerstats) {
  const providerData = providerstats.split(/\r?\n/).filter((d) => d);
  const allProviders = providerData.slice(1).map(line => {
    const data = line.split(",");
    const label = data[0];
    const concentration = parseInt(data[1]);
    const impact = parseInt(data[2]);

    return {
      label,
      concentration,
      impact,
    }
  });

  return allProviders;
}

const CountryDashboard = (props) => {
  const fgRef = useRef();
  const {country, title} = props;

  const [curCountry, setcurCountry] = useState("");
  const [service, setService] = useState("dns");
  const [snapshot, setSnapshot] = useState("202210");
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState({"nodes": [], "links": []});
  const [allNodes, setAllNodes] = useState([]);
  const [serviceNodes, setServiceNodes] = useState([]);
  const [allClientNum, setAllClientNum] = useState(0);
  const [thirdNum, setThirdNum] = useState(0);
  const [thirdOnlyNum, setThirdOnlyNum] = useState(0);
  const [criticalNum, setCriticalNum] = useState(0);
  const [privateAndThirdNum, setPrivateAndThirdNum] = useState(0);
  const [initialResult, setInitialResult] = useState([]);
  const [searchResult, setSearchResult] = useState(initialResult);
  const [searchHeading, setSearchHeading] = useState("Providers");
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState(["202210"]);

  function getWebsites(privateAndThird) {
    return Object.keys(privateAndThird).map((key, index) => ( 
      <MDTypography color="white">
        {key} {privateAndThird[key]}
      </MDTypography>
    ))
    
  }
  


  
  function getServiceStats(country, service, month){
    fetch(raw)
    .then(r => r.text())
    .then((response) => {
      // console.log(response);
      const [graph, allNodes, clientNum, thirdNum, criticalNum, redundantNum, privateAndThirdNum,privateAndThird] = getGraphStats(response, "dns");
      setServiceNodes(allNodes);
      });
  }

  function get_file_list(country, service,month) {
    fetch(`${process.env.REACT_APP_API_ADDRESS}:5000/country/${country}/service/${service}/month/${month}/list`)
    .then((r) => r.json())
    .then((response) => {
      let files = response.data.split(";")
      setFileList(files)
      console.log(fileList)
    })
    .then(() => {
      setSnapshot(fileList.at(-1))
      console.log(snapshot, service)
      setService(service);
      console.log(service, service)
    })
    .then(() => {
      console.log("getting data", service, country, snapshot)
      getData(country, service, snapshot)
      // setLoading(true);
    })
  }
  function getData(country, service, month) {
    const data_name = `${country}-${service}-${month}`
    if(cache.hasOwnProperty(data_name)) {
      console.log("found in cache")
      const response = cache[data_name]
      const [graph, allNodes, clientNum, thirdNum, criticalNum, thirdOnlyNum, privateAndThirdNum] = getGraphStats(response.data, service);
        // const table_rows = createTable(response.data)
          // setTable(table_rows);
        setGraph(graph);
        setAllNodes(allNodes);
        setAllClientNum(clientNum);
        setThirdOnlyNum(thirdNum);
        setThirdOnlyNum(thirdOnlyNum)
        setCriticalNum(criticalNum);
        setPrivateAndThirdNum(privateAndThirdNum);
        setInitialResult(getTop5Providers(allNodes));
        setSearchResult(getTop5Providers(allNodes));
        setLoading(false);
      // getServiceStats(country,service,month)
    } else {
      fetch(`${process.env.REACT_APP_API_ADDRESS}:5000/country/${country}/service/${service}/month/${month}`)
      .then((r) => r.json())
      .then((response) => {
        const [graph, allNodes, clientNum, thirdNum, criticalNum, thirdOnlyNum, privateAndThirdNum] = getGraphStats(response.data, service);
        // const table_rows = createTable(response.data)
          // setTable(table_rows);
        setGraph(graph);
        setAllNodes(allNodes);
        setAllClientNum(clientNum);
        setThirdNum(thirdNum);
        setThirdOnlyNum(thirdOnlyNum)
        setCriticalNum(criticalNum);
        setPrivateAndThirdNum(privateAndThirdNum);
        setInitialResult(getTop5Providers(allNodes));
        setSearchResult(getTop5Providers(allNodes));
        setLoading(false);
      });
    }
  }

  const onSearchByLabel = (e) => {
    setSearchResult(initialResult);
    setSearchHeading("Providers");
    const term = e.target.value;

    if (term) {
      // console.log(allNodes)
      const resultNodes = allNodes
        .filter((n) => n.label.toString().toLowerCase().includes(term.toLowerCase()))
        .sort((n1, n2) => {
          if(n1.nodeType == "Provider" && n2.nodeType == "Provider") {
            return n2.conc.size - n1.conc.size
          }
          else if(n1.nodeType == "Client" && n2.nodeType == "Client") {
            return n2.Third.size - n1.Third.size
          } else {
            return n1.nodeType == "Provider" - n2.nodeType == "Provider"
          }

        });
      setSearchResult(resultNodes.slice(0, top_n));
      setSearchHeading("results")
    }
  };
  
  const onServiceChange = (e) => {
    const curService = e.target.value;
    get_file_list(country, curService, snapshot)
    // setSnapshot(fileList.at(-1))
    // console.log(snapshot, curService)
    // setService(curService);
    // setLoading(true);
    // getData(country, curService, snapshot)
    
  }
  const onSnapshotChange = (e) => {
    const curSnapshot = e.target.value;
    setSnapshot(curSnapshot);
    setLoading(true);
    getData(country, service, curSnapshot)
  }

  if (country && country !== curCountry ) {
    setcurCountry(country);
    // setLoading(true);
    let newDate = new Date()
    let month = newDate.getMonth() - 1;
    let year = newDate.getFullYear();
    let mysnapshot = "202210"
    if(month < 10) {
      mysnapshot = `${year}0${month}`
    } else {
      mysnapshot = `${year}${month}`
    }
    
    get_file_list(country, service, mysnapshot)
    // const latest_snapshot = fileList.at(-1)
    // console.log(mysnapshot, latest_snapshot, fileList)
    // setSnapshot(latest_snapshot)
    // getData(country, service, latest_snapshot)
  }

  return (
    <DashboardLayout>
      <DashboardNavbar title={title} service={service} onServiceChange={onServiceChange} showService snapshot={snapshot} onSnapshotChange={onSnapshotChange} fileList={fileList} showSnapshot />
      {loading ?
      <CircularProgress sx={{ display: 'flex', marginLeft:"48%" }} color="info" size="4rem"/> :
      <MDBox py={3}>
        <MDBox mb={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={8}>
              <Graph graphData={graph} service={service} ></Graph>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Search onSearchInputChange={onSearchByLabel} searchResult={searchResult} heading={searchHeading} service={service} servicedep={serviceNodes} totalClients={allClientNum} />
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Card style={{ backgroundColor: "#b45f06" }} >
                <CardContent>
                  <MDTypography color="white">
                    Third-party
                  </MDTypography>
                  <MDTypography pr={5} display="inline" variant="h2" color="white">
                    {thirdNum.toLocaleString()}
                  </MDTypography>
                  <MDTypography display="inline" variant="h4" color="white">
                      {getPercentage(thirdNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox>
              <Card style={{ backgroundColor: "#d63232" }}>
                <CardContent>
                  <MDTypography color="white">
                    Critical
                  </MDTypography>
                  <MDTypography pr={5} display="inline" variant="h2" color="white">
                    {criticalNum.toLocaleString()}
                  </MDTypography>
                  <MDTypography display="inline" variant="h4" color="white">
                      {getPercentage(criticalNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Card style={{ backgroundColor: "#326a1a" }} >
                <CardContent>
                  <MDTypography color="white">
                  {service == "dns" && "Multiple Third"}
                  {service == "cdn" && "Multiple Third"}
                  {service == "ocsp" && "Stapling Support"}
                  </MDTypography>
                  <MDTypography pr={5} display="inline" variant="h2" color="white">
                    {thirdOnlyNum.toLocaleString()}
                  </MDTypography>
                  <MDTypography display="inline" variant="h4" color="white">
                    {getPercentage(thirdOnlyNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
          {service != "ocsp" && <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Card style={{ backgroundColor: "#0b5394" }}>
                <CardActionArea onClick={()=>setOpen(!open)}>
                  <CardContent>
                    <MDTypography color="white">
                    Private and Third-party
                    </MDTypography>
                    <MDTypography pr={5} display="inline" variant="h2" color="white">
                      {privateAndThirdNum.toLocaleString()}
                    </MDTypography>
                    <MDTypography display="inline" variant="h4" color="white">
                      {getPercentage(privateAndThirdNum, allClientNum)}%
                    </MDTypography>
                  </CardContent>
                  {/* <Collapse in={open} timeout="auto" unmountOnExit>
                    <CardContent>
                      {
                        getWebsites(privateAndThird)
                      }
                    </CardContent>
                  </Collapse> */}
                </CardActionArea>
              </Card>
            </MDBox>
          </Grid>}
        </Grid>
      </MDBox>}
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default CountryDashboard;
