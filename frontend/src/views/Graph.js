import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useHistory, useLocation } from 'react-router-dom';
import Search from '@geist-ui/react-icons/search'
import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const location = useLocation();
    const graphData = useStoreState(state => state.dnsData)
    const setDnsData = useStoreActions(actions => actions.setDnsData)
    let dnsData = require('../data/dns.json')
    const fgRef = useRef();

    const nodeColor = n => {
        if (n.nodeType == 'Client') {
            return '#003366'
        } else {
            return '#33c0c0'
        }
    }

    useEffect(() => {
        const fg = fgRef.current;
        console.log(props.size.width)
        fg.d3Force('charge', d3.forceManyBody().strength(-6));
        fg.d3Force('collide', d3.forceCollide(function(d) {
            return d.val * 0.8
          }));
          setDnsData(dnsData);
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={graphData}
            minZoom={0.2}
            width={props.size.width}
            nodeLabel="label"
            nodeColor={nodeColor}
        />
    )
};

export default withSize()(Graph);