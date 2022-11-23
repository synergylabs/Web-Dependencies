import React from 'react'
import { Card, Grid, Text } from '@geist-ui/react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import Graph from './Graph';
import NodeSearch from './NodeSearch';
import Client from '../../clients/BoxClient'

const Dashboard = () => {
    const setNodeDetails = useStoreActions(actions => actions.setNodeDetails)
    const setSearchTerm = useStoreActions(actions => actions.setSearchTerm)

    const dnsData = require('../../data/dns.json')

    const dataToShow = dnsData

    // Don't display providers with only one client
    // function filterDataToShow({nodes, links}) {
    //     console.log(links)
    //     const nodeToRemove = new Set()
    //     let newNodes = nodes
    //     const newLinks = links.filter(link => {
            
    //         const sourceId = link.source
    //         console.log(sourceId)
    //         const sourceIndex = Number(sourceId.substr(1))
    //         const sourceNode = newNodes[sourceIndex-1]
    //         const targetId = link.target
    //         const targetIndex = Number(targetId.substr(1))
    //         const targetNode = newNodes[targetIndex-1]
    //         console.log(sourceNode)
    //         console.log(targetNode)
    //         if (sourceNode.count == 1 && targetNode.count == 1) {
    //             nodeToRemove.add(sourceId)
    //             nodeToRemove.add(targetId)
    //             return false;
    //         }
    //         return true
    //     });
    //     newNodes = newNodes.filter(n => !nodeToRemove.has(n.id))

    //     return {
    //         nodes: newNodes,
    //         links: newLinks,
    //     }
    // }

    const clearSearch = e => {
        setNodeDetails([])
        setSearchTerm('')
    }
    const onNodeClick = node => {
        setNodeDetails([])
        setSearchTerm('')

        const nodes = dnsData.nodes.filter(n => n.id == node.id)

        setSearchTerm(nodes[0].label)
        setNodeDetails(nodes)
    };

    const onSearchByLabel = e => {
        setNodeDetails([])
        const term = e.target.value
        setSearchTerm(term)

        if (term) {
            const top_n = 5
            const all_nodes = dnsData.nodes
                                .filter(n => n.label.toLowerCase().includes(term))
                                .sort((n1, n2) => n2.val - n1.val)
            setNodeDetails(all_nodes.slice(0, top_n))
        }
    }

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
                                <NodeSearch 
                                    onSearchInputChange={onSearchByLabel}
                                    onClearClick={clearSearch}
                                />
                            </Card>
                        </Grid> 
                    </Grid.Container>
                </Grid>
                <Grid xs={16}>
                    <Card shadow width="100%" >
                        <Graph 
                            graphData={dataToShow}
                            clearSearch={clearSearch}
                            onNodeClick={onNodeClick}
                        />
                    </Card>
                </Grid>
            </Grid.Container>
        </>
	)
}

export default Dashboard