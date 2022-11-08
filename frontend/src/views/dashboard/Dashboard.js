import React from 'react'
import { Card, Grid, Text } from '@geist-ui/react'
import Graph from './Graph';
import NodeSearch from './NodeSearch';
import { useStoreState, useStoreActions } from 'easy-peasy'

const Dashboard = () => {
    const setNodeDetails = useStoreActions(actions => actions.setNodeDetails)

    const dnsData = require('../../data/dns.json')

    const onNodeClick = node => {
        const nodes = dnsData.nodes.filter(n => n.id == node.id)
        setNodeDetails(nodes)
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
                            <Card shadow width="100%" >
                                <NodeSearch />
                            </Card>
                        </Grid> 
                    </Grid.Container>
                </Grid>
                <Grid xs={16}>
                    <Card shadow width="100%" >
                        <Graph 
                            onNodeClick={onNodeClick}
                            graphData={dnsData}
                        />
                    </Card>
                </Grid>
            </Grid.Container>
        </>
	)
}

export default Dashboard