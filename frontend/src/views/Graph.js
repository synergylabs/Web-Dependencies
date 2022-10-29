import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Row, Col, Text, Select, Spacer, Input, Card } from '@geist-ui/react'
import Search from '@geist-ui/react-icons/search'

const Graph = () => {
    const service = useStoreState(state => state.service)
    const graphData = useStoreState(state => state.dnsData)
    const setDnsData = useStoreActions(actions => actions.setDnsData)
    let dnsData = require('../data/dns.json')
    
    const fgRef = useRef();
    

    console.log(graphData)
    const nodeColor = n => {
        if (n.group == 'Client') {
            return '#003366'
        } else {
            return '#33c0c0'
        }
    }

    useEffect(() => {
        const fg = fgRef.current;

        fg.d3Force('charge', d3.forceManyBody());
        fg.d3Force('collide', d3.forceCollide(function(d) {
            return d.val / 1.5
          }));
          setDnsData(dnsData);
    }, []);


    return (<Row gap={.8}>
        <Col span={4}>
        </Col>
        <Col span={20}>
            <ForceGraph2D 
                ref={fgRef}
                graphData={graphData}
                nodeLabel="label"
                nodeColor={nodeColor}
            />
        </Col>
    </Row>);
};

export default Graph;