import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Grid from "@mui/material/Grid";
import { ForceGraph2D } from "react-force-graph";
import { withSize } from "react-sizeme";
import Config from "./Config";
import usDns from "./data/us-dns.png";

function Graph(props) {
  // const [zoomK, setZoomK] = useState(1);
  // const { graphData, size, onNodeClick, clearSearch } = props;
  // const fgRef = useRef();

  // useEffect(() => {
  //   const fg = fgRef.current;
  //   fg.d3Force("charge", d3.forceManyBody().strength(-110));
  //   fg.d3Force(
  //     "collide",
  //     d3.forceCollide((d) => d.val * 1.2)
  //   );
  //   fg.d3Force("x", d3.forceX());
  //   fg.d3Force("y", d3.forceY());
  // }, []);

  // function updateZoomK(event) {
  //   setZoomK(event.k);
  // }
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item>
        <img src={usDns} alt="Logo" />
      </Grid>
    </Grid>
  );
  // return (
  //   <ForceGraph2D
  //     ref={fgRef}
  //     graphData={graphData}
  //     minZoom={0.05}
  //     maxZoom={10}
  //     onZoom={(event) => updateZoomK(event)}
  //     width={size.width}
  //     nodeLabel="label"
  //     nodeRelSize={4}
  //     nodeColor={(n) => (n.nodeType === "Client" ? Config.ClientColor : Config.ProviderColor)}
  //     nodeVal={(n) => (n.nodeType === "Client" ? n.val * 4 : n.val ** 2 / 50)}
  //     linkWidth={0.4}
  //     onNodeClick={onNodeClick}
  //     onBackgroundClick={clearSearch}
  //     nodeCanvasObjectMode={() => "after"}
  //     nodeCanvasObject={(node, ctx, globalScale) => {
  //       if (node.nodeType === "Provider") {
  //         const { label } = node;
  //         // const fontSize = (node.val * zoomK * 0.22) / globalScale;
  //         const fontSize = (0.01 * node.val * zoomK) / globalScale;
  //         ctx.font = `${fontSize}em Arial`;
  //         ctx.textAlign = "center";
  //         ctx.textBaseline = "middle";
  //         ctx.fillStyle = "black";
  //         ctx.fillText(label, node.x, node.y + 6);
  //       } else {
  //         ctx.strokeStyle = "white";
  //         ctx.stroke();
  //       }
  //     }}
  //   />
  // );
}

export default withSize()(Graph);
