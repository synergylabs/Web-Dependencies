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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
// import Projects from "layouts/dashboard/components/Projects";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Graph from "layouts/dashboard/components/DependencyGraph/Graph";
import Search from "layouts/dashboard/components/DependencyGraph/Search";
// import data from "layouts/dashboard/components/DependencyGraph/data/dns.json";
import raw from "data/dns-us-202210";
import nsProvider from "data/nsProvider.json";
import { ContactSupportOutlined } from "@mui/icons-material";

const top_n = 5;
const getTop5Providers = (nodes) => {
  nodes = nodes.filter((n) => n.nodeType === "Provider").sort((n1, n2) => n2.val - n1.val);
  return nodes.slice(0, top_n);
};

const getGraph = (text) => {
  const nodes = [];
  const links = [];
  const criticalClients = new Set();
  const providerClients = {};
  const clientIndices = {};
  const providerIndices = {};
  let graph = {};

  const allData = text.split(/\r?\n/);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const providerType = line[3];
    if (providerType === "Third") {
      const rank = line[0];
      const client = line[1];
      const provider = line[2] in nsProvider ? nsProvider[line[2]] : line[4];

      if (!providerClients.hasOwnProperty(provider)) {
        providerClients[provider] = new Set();
      }

      if (!providerClients[provider].has(client)) {
        providerClients[provider].add(client)

        if (clientIndices.hasOwnProperty(client)) {
          const clientIndex = clientIndices[client];
          nodes[clientIndex]["val"] = nodes[clientIndex]["val"] + 1;
          criticalClients.delete(client);
        } else {
          criticalClients.add(client);
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
            label: provider,
            nodeType: "Provider",
            val: 1,
            impact: [],
          });
          index += 1
        }
      }
    }
  });

  
  const allNodes = [...nodes];
  const topProviders = new Set(nodes.sort((n1, n2) => n2.val - n1.val).slice(0, 50).map((n) => n.id));
  const nodeToGraph = [];

  for (const p in providerClients) {
    const curClients = providerClients[p];
    const providerIndex = providerIndices[p];
    if (topProviders.has(providerIndex)) {
      nodeToGraph.push(allNodes[providerIndex]);
    }
    curClients.forEach((c) => {
      if (criticalClients.has(c)) {
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

  graph = {
    nodes: nodeToGraph,
    links: links,
  };
  return [graph, allNodes];
};

const Dashboard = () => {
  const [graph, setGraph] = useState({"nodes": [], "links": []});
  const [allNodes, setAllNodes] = useState([]);
  const [initialResult, setInitialResult] = useState([]);
  const [searchResult, setSearchResult] = useState(initialResult);
  
  if (allNodes.length == 0) {
    fetch(raw)
    .then((r) => r.text())
    .then((text) => {
      const [graph, allNodes] = getGraph(text);
      setGraph(graph);
      setAllNodes(allNodes);
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
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid> */}
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Dashboard;
