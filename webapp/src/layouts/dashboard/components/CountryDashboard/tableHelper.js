import * as React from "react";

// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';

export function createTable(data) {
  const allData = data.split(/\r?\n/).filter((d) => d);
  const node_data = {};
  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const rank = line[0];
    const client = line[1];
    const providerType = line[3];
    const provider = line[2];
    node_data[[rank, client]] = {};
    if (!node_data[[rank, client]].hasOwnProperty(providerType)) {
      node_data[[rank, client]][providerType] = new Set();
    }
    node_data[[rank, client]][providerType].add(provider);
  });
  return node_data;
}

// export function showTable(data) {
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Rank</TableCell>
//             <TableCell align="right">Website</TableCell>
//             <TableCell align="right">Third-party providers</TableCell>
//             <TableCell align="right">Private Providers</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {Object.keys(table).map((key, index) => (
//             <TableRow key={key[0]} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
//               <TableCell component="th" scope="row">
//                 {key[1]}
//               </TableCell>
//               <TableCell align="right">{key}</TableCell>
//               <TableCell align="right">{key}</TableCell>
//               <TableCell align="right">{key}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
