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
import { useState } from "react";

// @mui material components
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Grid";

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
import { getDnsGraphStats, getCdnGraphStats, getCaGraphStats } from "./graphStatsHelper"

const top_n = 5;
const getTop5Providers = (nodes) => {
  nodes = nodes.filter((n) => n.nodeType === "Provider").sort((n1, n2) => n2.val - n1.val);
  return nodes.slice(0, top_n);
};

const getGraphStats = (text, service) => {
  if (service === "dns") {
    return getDnsGraphStats(text);
  } else if (service === "cdn") {
    console.log(text)
    return getCdnGraphStats(text);
  } else {
    return getCaGraphStats(text);
  }
}

function getPercentage(value, total) {
  return Math.round(100*value/total);
}

const Dashboard = (props) => {
  const {country} = props;

  const [curCountry, setcurCountry] = useState("");
  const [service, setService] = useState("dns")
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState({"nodes": [], "links": []});
  const [allNodes, setAllNodes] = useState([]);
  const [allClientNum, setAllClientNum] = useState(0);
  const [thirdOnlyNum, setThirdOnlyNum] = useState(0);
  const [criticalNum, setCriticalNum] = useState(0);
  const [redundantNum, setredundantNum] = useState(0);
  const [privateAndThirdNum, setPrivateAndThirdNum] = useState(0);
  const [initialResult, setInitialResult] = useState([]);
  const [searchResult, setSearchResult] = useState(initialResult);
  console.log(service);

  function getData(country, service, month) {
    fetch(`http://webdependency.andrew.cmu.edu:5000/country/${country}/service/${service}/month/${month}`)
    .then((r) => r.json())
    .then((response) => {
      const [graph, allNodes, clientNum, thirdNum, criticalNum, redundantNum, privateAndThirdNum] = getGraphStats(response.data, service);
      setGraph(graph);
      setAllNodes(allNodes);
      setAllClientNum(clientNum)
      setThirdOnlyNum(thirdNum)
      setCriticalNum(criticalNum);
      setredundantNum(redundantNum);
      setPrivateAndThirdNum(privateAndThirdNum);
      setInitialResult(getTop5Providers(allNodes));
      setSearchResult(getTop5Providers(allNodes));
      setLoading(false);
    });
  }

  const onSearchByLabel = (e) => {
    setSearchResult(initialResult);
    const term = e.target.value;

    if (term) {
      const resultNodes = allNodes
        .filter((n) => n.label.toLowerCase().includes(term.toLowerCase()))
        .sort((n1, n2) => n2.val - n1.val);
      setSearchResult(resultNodes.slice(0, top_n));
    }
  };

  const onServiceChange = (e) => {
    const curService = e.target.value;
    setService(curService);
    setLoading(true);
    getData(country, curService, "202210")
  }

  if (country && country !== curCountry ) {
    setcurCountry(country);
    setLoading(true);
    getData(country, service, "202210")
  }

  return (
    <DashboardLayout>
      <DashboardNavbar service={service} onServiceChange={onServiceChange}/>
      {loading ?
      <CircularProgress sx={{ display: 'flex', marginLeft:"48%" }} color="info" size="4rem"/> :
      <MDBox py={3}>
        <MDBox mb={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={8}>
              <Card>
                <MDBox>
                  <Graph graphData={graph} />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Search onSearchInputChange={onSearchByLabel} searchResult={searchResult} />
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Card style={{ backgroundColor: "#b45f06" }} >
                <CardContent>
                  <MDTypography color="white">
                    Third-party Dependency
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
          <Grid item xs={12} md={6} lg={3}>
            <MDBox>
              <Card style={{ backgroundColor: "#d63232" }}>
                <CardContent>
                  <MDTypography color="white">
                    Critical Dependency
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
                    Redundancy
                  </MDTypography>
                  <MDTypography pr={5} display="inline" variant="h2" color="white">
                    {redundantNum}
                  </MDTypography>
                  <MDTypography display="inline" variant="h4" color="white">
                    {getPercentage(redundantNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Card style={{ backgroundColor: "#0b5394" }}>
                <CardContent>
                  <MDTypography color="white">
                    Private and Third-party
                  </MDTypography>
                  <MDTypography pr={5} display="inline" variant="h2" color="white">
                    {privateAndThirdNum}
                  </MDTypography>
                  <MDTypography display="inline" variant="h4" color="white">
                    {getPercentage(privateAndThirdNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>}
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default Dashboard;
