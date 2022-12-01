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
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

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

import raw from "data/dns-us-202210";
import nsProvider from "data/nsProvider.json";

const top_n = 5;
const getTop5Providers = (nodes) => {
  nodes = nodes.filter((n) => n.nodeType === "Provider").sort((n1, n2) => n2.val - n1.val);
  return nodes.slice(0, top_n);
};

const getGraph = (text) => {
  const nodes = [];
  const links = [];
  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = new Set();
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = line[1];
    const providerType = line[3];
    const provider = line[4];
    
    if (providerType === "Pvt") {
      clientPrivateProviders.add(client);
      allKnownClients.add(client);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client);
    }
    else if (providerType === "Third") {
      allKnownClients.add(client);
      const rank = line[0];

      if (!clientThirdProviders.hasOwnProperty(client)) {
        clientThirdProviders[client] = new Set();
      }
      if (!providerClients.hasOwnProperty(provider)) {
        providerClients[provider] = new Set();
      }

      clientThirdProviders[client].add(provider);
      
      if (!providerClients[provider].has(client)) {
        providerClients[provider].add(client)

        if (clientIndices.hasOwnProperty(client)) {
          const clientIndex = clientIndices[client];
          nodes[clientIndex]["val"] = nodes[clientIndex]["val"] + 1;
        } else {
          clientIndices[client] = index;
          nodes.push({
            id: index,
            rank: rank,
            label: client,
            nodeType: "Client",
            val: 1,
          });
          index += 1;
        }

        if (providerIndices.hasOwnProperty(provider)) {
          const providerIndex = providerIndices[provider];
          nodes[providerIndex]["val"] = nodes[providerIndex]["val"] + 1;
        } else {
          providerIndices[provider] = index;
          nodes.push({
            id: index,
            label: provider in nsProvider ? nsProvider[provider] : provider,
            nodeType: "Provider",
            val: 1,
            impact: [],
          });
          index += 1
        }
      }
    }
  });

  // Client centric stats
  let thirdOnlyNum = 0;
  let criticalNum = 0;
  let redundantNum = 0;
  let privateAndThirdNum = 0;
  let multipleThirdNum = 0;

  allKnownClients.forEach((c) => {
    if (!clientUnknownProviders.has(c)) {
      if (clientThirdProviders.hasOwnProperty(c)) {
        if (clientThirdProviders[c].size > 1) {
          redundantNum++;
          multipleThirdNum++;
        }
      }
      if (clientPrivateProviders.has(c) && clientThirdProviders.hasOwnProperty(c)) {
        privateAndThirdNum++;
        redundantNum++;
      } else if (clientThirdProviders.hasOwnProperty(c)) {
        thirdOnlyNum++;
  
        if (clientThirdProviders[c].size == 1) {
          criticalNum++;
        }
      }
    }
  });

  // Provider centric graph
  const allNodes = [...nodes];
  const topProviders = new Set(nodes.sort((n1, n2) => n2.val - n1.val).slice(0, 15).map((n) => n.id));
  const nodeToGraph = [];

  for (const p in providerClients) {
    const curClients = providerClients[p];
    const providerIndex = providerIndices[p];
    if (topProviders.has(providerIndex)) {
      nodeToGraph.push(allNodes[providerIndex]);
    }
    curClients.forEach((c) => {
      if (clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].push(c);
      }
      if (topProviders.has(providerIndex)) {
        const clientIndex = clientIndices[c];
        nodeToGraph.push(allNodes[clientIndex]);
        links.push({
          source: providerIndex,
          target: clientIndex,
        });
      }
    })
  }

  const graph = {
    nodes: nodeToGraph,
    links: links,
  };

  return [graph, allNodes, allKnownClients.size, thirdOnlyNum, criticalNum, redundantNum, privateAndThirdNum];
};

function getPercentage(value, total) {
  return Math.round(100*value/total);
}

const Dashboard = () => {
  const [graph, setGraph] = useState({"nodes": [], "links": []});
  const [allNodes, setAllNodes] = useState([]);
  const [allClientNum, setAllClientNum] = useState(0);
  const [thirdOnlyNum, setThirdOnlyNum] = useState(0);
  const [criticalNum, setCriticalNum] = useState(0);
  const [redundantNum, setredundantNum] = useState(0);
  const [privateAndThirdNum, setPrivateAndThirdNum] = useState(0);
  const [initialResult, setInitialResult] = useState([]);
  const [searchResult, setSearchResult] = useState(initialResult);
  
  if (allNodes.length == 0) {
    fetch(raw)
    .then((r) => r.text())
    .then((text) => {
      const [graph, allNodes, clientNum, thirdNum, criticalNum, redundantNum, privateAndThirdNum] = getGraph(text);
      setGraph(graph);
      setAllNodes(allNodes);
      setAllClientNum(clientNum)
      setThirdOnlyNum(thirdNum)
      setCriticalNum(criticalNum);
      setredundantNum(redundantNum);
      setPrivateAndThirdNum(privateAndThirdNum);
      setInitialResult(getTop5Providers(allNodes));
      setSearchResult(getTop5Providers(allNodes));
     
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  <MDTypography pr={5} display="inline" variant="h1" color="white">
                    {thirdOnlyNum.toLocaleString()}
                  </MDTypography>
                  <MDTypography display="inline" variant="h3" color="white">
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
                  <MDTypography pr={5} display="inline" variant="h1" color="white">
                    {criticalNum.toLocaleString()}
                  </MDTypography>
                  <MDTypography display="inline" variant="h3" color="white">
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
                  <MDTypography pr={5} display="inline" variant="h1" color="white">
                    {redundantNum}
                  </MDTypography>
                  <MDTypography display="inline" variant="h3" color="white">
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
                  <MDTypography pr={5} display="inline" variant="h1" color="white">
                    {privateAndThirdNum}
                  </MDTypography>
                  <MDTypography display="inline" variant="h3" color="white">
                    {getPercentage(privateAndThirdNum, allClientNum)}%
                  </MDTypography>
                </CardContent>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Dashboard;
