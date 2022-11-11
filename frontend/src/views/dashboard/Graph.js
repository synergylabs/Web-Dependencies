import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import Config from './Config'
import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const fgRef = useRef();

    const nodeColor = n => {
        if (n.nodeType == 'Client') {
            return Config.ClientColor
        } else {
            return Config.ProviderColor
        }
    }

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge', d3.forceManyBody().strength(-3));
        fg.d3Force('collide', d3.forceCollide(d => {
            return d.val * 0.75
        }));
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={props.graphData}
            minZoom={0.2}
            width={props.size.width}
            nodeLabel="label"
            nodeRelSize={6}
            nodeColor={nodeColor}
            onNodeClick={props.onNodeClick}
        />
    )
};

export default withSize()(Graph);