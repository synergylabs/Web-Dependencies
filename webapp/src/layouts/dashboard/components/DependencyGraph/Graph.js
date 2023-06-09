import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Grid from "@mui/material/Grid";
import { ForceGraph2D } from "react-force-graph";
import { withSize } from "react-sizeme";
import Config from "./Config";
import usDns from "./data/us-dns.png";

function Graph(props) {
  const { graphData, service } = props;
  const fgRef = useRef();
  var width = 600;
  var height = 900;
  useEffect(() => {
    const fg = fgRef.current;
    fg.d3Force("center", null);
    fg.d3Force("charge", null);
    fg.d3Force(
      "collide",
      d3.forceCollide(function (d) {
        var rad = findRadius(d);
        if (rad == 3) return rad * 2 + 1;
        return rad + 1;
      })
    );
    // fg.d3Force("box", () => {
    //   const SQUARE_HALF_SIDE = 5000;

    //   graphData.nodes.forEach((node) => {
    //     const x = node.x || 0,
    //       y = node.y || 0;

    //     // bounce on box walls
    //     if (Math.abs(x) > SQUARE_HALF_SIDE) {
    //       node.vx *= -1;
    //     }
    //     if (Math.abs(y) > SQUARE_HALF_SIDE) {
    //       node.vy *= -1;
    //     }
    //   });
    // });
    // fg.d3Force("x", d3.forceX());
    // fg.d3Force("y", d3.forceY());
    // fg.d3Force("charge", d3.forceManyBody());
    // fg.d3Force("charge").distanceMax(2);
    // fg.d3Force("charge").strength(-1);
    // fg.d3Force("center", d3.forceCenter(width / 2, height / 2));
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      width={700}
      height={900}
      graphData={graphData}
      d3AlphaDecay={0.25}
      d3VelocityDecay={0.25}
      minZoom={0.2}
      maxZoom={0.5}
      nodeLabel="label"
      cooldownTime={5000}
      // nodeRelSize={4}
      // nodeColor={(n) => (n.nodeType === "Client" ? Config.ClientColor : Config.ProviderColor)}
      // nodeVal={(n) => (n.nodeType === "Client" ? n.val * 4 : n.val ** 2 / 50)}
      // linkWidth={0.4}
      nodeCanvasObjectMode={() => "after"}
      nodeCanvasObject={(node, ctx) => nodeShape(node, ctx, service)}
      onEngineStop={() => fgRef.current.zoomToFit(400)}
    />
  );
}
const getColor = (n) => {
  const colors = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
  ];
  return colors[n % 12];
};
const getServiceColor = (service) => {
  if (service == "dns") {
    return "#CDDC39";
  }
  if (service == "cdn") {
    return "#80D8FF";
  }
  return "#F9A825";
};

function nodeShape(node, ctx, service) {
  if (node.conc) {
    const indegree = node.conc.size;
    ctx.fillStyle = getServiceColor(service);
    ctx.beginPath();
    ctx.arc(node.x, node.y, findRadius(node), 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.fillStyle = "#4C4E52";
    const fontSize = Math.max(indegree / 10, 30);
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  } else {
    ctx.fillStyle = getColor(node.id);
    ctx.beginPath();
    ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
function findRadius(n) {
  if (n.conc) {
    var count = n.conc.size;
    count = 5 + count / 5;
    return count;
  }
  return 3;
}
export default withSize()(Graph);
