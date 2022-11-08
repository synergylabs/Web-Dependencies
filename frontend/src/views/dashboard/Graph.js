import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useHistory, useLocation } from 'react-router-dom';

import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const client_color = '#003366'
    const provider_color = '#33c0c0'
    const fgRef = useRef();

    const nodeColor = n => {
        if (n.nodeType == 'Client') {
            return client_color
        } else {
            return provider_color
        }
    }

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge', d3.forceManyBody().strength(-1));
        fg.d3Force('collide', d3.forceCollide(d => {
            return d.val * 0.7
        }));
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={props.graphData}
            minZoom={0.2}
            width={props.size.width}
            nodeLabel="label"
            nodeColor={nodeColor}
            nodeRelSize={6}
            onNodeClick={props.onNodeClick}
        />
    )
};

export default withSize()(Graph);