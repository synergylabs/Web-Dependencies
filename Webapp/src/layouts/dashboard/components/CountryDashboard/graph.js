// import { ForceGraph2D } from "react-force-graph";
// import * as d3 from "d3";
// import * as ReactDOM from "react-dom";

// import React, { useRef, useState, useEffect } from "react";
// const CollisionDetectionFG = (data) => {
//   const fgRef = useRef();
//   // console.log(data);

//   // const [graphData, setGraphData] = useState({ nodes: [], links: [] });

//   // useEffect(() => {
//   const fg = fgRef.current;
//   // Deactivate existing forces
//   // fg.d3Force("center", null);
//   // fg.d3Force("charge", null);
//   // // console.log("hete", data);
//   // // Add collision and bounding box forces
//   // fg.d3Force("collide", d3.forceCollide(4));
//   // setGraphData(data);
//   // }, []);
//   return (
//     <ForceGraph2D
//       ref={fgRef}
//       graphData={data}
//       // minZoom={0.3}
//       // maxZoom={1}
//       // width={900}
//       // heigth={600}
//       // nodeCanvasObject={(node, ctx) => nodeShape(node, ctx)}
//       // linkWidth={1.5}
//       // linkColor={() => "darkgrey"}
//       d3AlphaDecay={0.25}
//       d3VelocityDecay={0.25}
//       cooldownTime={5000}
//       // onEngineStop={() => fgRef.current.zoomToFit(400)}
//     />
//   );
// };
// export function showGraph(data, fgRef) {
//   return (
//     <ForceGraph2D
//       ref={fgRef}
//       graphData={data}
//       minZoom={0.3}
//       maxZoom={1}
//       width={900}
//       heigth={600}
//       nodeCanvasObject={(node, ctx) => nodeShape(node, ctx)}
//       linkWidth={1.5}
//       linkColor={() => "darkgrey"}
//       d3AlphaDecay={0.25}
//       d3VelocityDecay={0.25}
//       cooldownTime={5000}
//       onEngineStop={() => fgRef.current.zoomToFit(400)}
//     />
//   );
// }
// function nodeShape(node, ctx) {
//   if (node.conc) {
//     ctx.fillStyle = "#76FF03";
//     ctx.beginPath();
//     ctx.arc(node.x, node.y, findRadius(node), 0, 2 * Math.PI, false);
//     ctx.fill();
//     ctx.fillStyle = "#4C4E52";
//     const fontSize = Math.max(node.inDegree / 10, 30);
//     ctx.font = `${fontSize}px Sans-Serif`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(node.id, node.x, node.y);
//   } else {
//     // ctx.fillStyle = color(node.group);
//     ctx.beginPath();
//     ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
//     ctx.fill();
//   }
// }
// function findRadius(n) {
//   var count = n.conc.size;
//   count = count == 0 ? 3 : 15 + count / 5;
//   return count;
// }
// // function appendInDegree(nodes, links) {
// //   for (var i = 0; i < nodes.length; i++) {
// //     nodes[i].inDegree = inDegree(nodes[i], links);
// //     // console.log(nodes[i].inDegree)
// //   }
// //   return nodes;
// // }

// // function inDegree(n, allLinks) {
// //   var degree = 0;
// //   for (var i = 0; i < allLinks.length; i++) {
// //     // console.log(allLinks[i].target)
// //     if (allLinks[i].target == n.id) {
// //       // console.log(degree)
// //       degree += 1;
// //     }
// //   }
// // }
