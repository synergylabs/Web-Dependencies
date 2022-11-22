import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import Config from './Config'
import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const fgRef = useRef();

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge', d3.forceManyBody());
        fg.d3Force('collide', d3.forceCollide(d => d.val));
        fg.d3Force('x', d3.forceX());
        fg.d3Force('y', d3.forceY());
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={props.graphData}
            minZoom={0.05}
            width={props.size.width}
            nodeLabel="label"
            nodeRelSize={2}
            nodeColor={n => n.nodeType == 'Client' ? Config.ClientColor : Config.ProviderColor}
            nodeVal={n => n.nodeType == 'Client' ? n.val : n.val ** 2 / 10}
            linkWidth={0.3}
            onNodeClick={props.onNodeClick}
            onBackgroundClick={props.clearSearch}
        />
    )
};

export default withSize()(Graph);