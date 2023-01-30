import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import MDTypography from "components/MDTypography";

function createData(date, description) {
  return { date, description };
}

const rows = [
  createData(
    "December 2022",
    "Our paper on A First Look at Third Party Service Dependencies in Africa was accepted at PAM’23"
  ),
];

export default function News() {
  return (
    <>
      <MDTypography variant="h3" fontWeight="medium">
        News
      </MDTypography>
      <TableContainer component={Paper} spacing={3} sx={{ boxShadow: "none" }}>
        <Table sx={{ minWidth: 650 }} aria-label="news-table">
          <TableBody spacing={3}>
            {rows.map((row) => (
              <TableRow key={row.date} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <MDTypography variant="h6" fontWeight="medium">
                    {row.date}
                  </MDTypography>
                </TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
