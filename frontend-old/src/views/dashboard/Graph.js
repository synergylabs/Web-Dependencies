import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ForceGraph2D } from 'react-force-graph';
import Config from './Config'
import { withSize } from 'react-sizeme'

const Graph = (props) => {
    const fgRef = useRef();
    let zoomK = 1;

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force('charge', d3.forceManyBody().strength(-110));
        fg.d3Force('collide', d3.forceCollide(d => d.val * 1.2));
        fg.d3Force('x', d3.forceX());
        fg.d3Force('y', d3.forceY());
    }, []);

    return (
        <ForceGraph2D 
            ref={fgRef}
            graphData={props.graphData}
            minZoom={0.05}
            maxZoom={10}
            onZoom={event => zoomK = event.k}
            width={props.size.width}
            nodeLabel="label"
            nodeRelSize={4}
            nodeColor={n => n.nodeType == 'Client' ? Config.ClientColor : Config.ProviderColor}
            nodeVal={n => n.nodeType == 'Client' ? n.val * 4 : n.val ** 2 / 50}
            linkWidth={0.4}
            onNodeClick={props.onNodeClick}
            onBackgroundClick={props.clearSearch}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, ctx, globalScale) => {
                if (node.nodeType == 'Provider') {
                    const label = node.label;
                    const fontSize = node.val * zoomK * 0.22 / globalScale ;
                    ctx.font = `${fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'black'; //node.color;
                    ctx.fillText(label, node.x, node.y + 6);
                } else {
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                }
                
            }}
            
        />
    )
};
  
export default withSize()(Graph);