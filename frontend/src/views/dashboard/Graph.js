import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import Config from './Config'
import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const fgRef = useRef();

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge', d3.forceManyBody().strength(-4));
        fg.d3Force('collide', d3.forceCollide(d => d.val * 1.3));
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={props.graphData}
            minZoom={0.05}
            width={props.size.width}
            nodeLabel="label"
            nodeRelSize={4}
            nodeColor={n => n.nodeType == 'Client' ? Config.ClientColor : Config.ProviderColor}
            nodeVal={n => n.nodeType == 'Client' ? n.val : n.val * 2}
            linkWidth={0.3}
            onNodeClick={props.onNodeClick}
            onBackgroundClick={props.clearSearch}
        />
    )
};

export default withSize()(Graph);