import React from "react";
import { Card, Grid, Text } from "@geist-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Graph from "./Graph";
import NodeSearch from "./Search";

const Dashboard = () => {
  const setNodeDetails = useStoreActions((actions) => actions.setNodeDetails);
  const setSearchTerm = useStoreActions((actions) => actions.setSearchTerm);

  const dnsData = require("../../data/dns.json");

  const dataToShow = dnsData;

  const clearSearch = (e) => {
    setNodeDetails([]);
    setSearchTerm("");
  };
  const onNodeClick = (node) => {
    setNodeDetails([]);
    setSearchTerm("");

    const nodes = dnsData.nodes.filter((n) => n.id == node.id);

    setSearchTerm(nodes[0].label);
    setNodeDetails(nodes);
  };

  const onSearchByLabel = (e) => {
    setNodeDetails([]);
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const top_n = 5;
      const all_nodes = dnsData.nodes
        .filter((n) => n.label.toLowerCase().includes(term))
        .sort((n1, n2) => n2.val - n1.val);
      setNodeDetails(all_nodes.slice(0, top_n));
    }
  };

  return (
    <>
      <Grid.Container gap={2} justify="center">
        <Grid xs={7}>
          <Grid.Container gap={1} justify="center">
            {/* <Grid xs={24}>
                            <Card shadow width="100%" >
                                <Text h2>Filter</Text>
                            </Card>
                        </Grid> */}
            <Grid xs={24}>
              <Card shadow width="100%">
                <NodeSearch onSearchInputChange={onSearchByLabel} onClearClick={clearSearch} />
              </Card>
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={16}>
          <Card shadow width="100%">
            <Graph graphData={dataToShow} clearSearch={clearSearch} onNodeClick={onNodeClick} />
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default Dashboard;
