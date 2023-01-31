import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ItemLink from "../ItemLink";

import MDTypography from "components/MDTypography";

function createData(date, description) {
  return { date, description };
}

const rows = [
  createData(
    "December 2022",
    <>
      Our paper on{" "}
      {
        <ItemLink
          link="https://www.andrew.cmu.edu/user/akashaf/assets/files/Webdep-africa.pdf"
          name="A First Look at Third Party Service Dependencies in Africa"
        />
      }{" "}
      was accepted at PAM'23
    </>
  ),
  createData(
    "January 2021",
    <>
      Our {<ItemLink link="https://dl.acm.org/doi/10.1145/3419394.3423664" name="IMC'20 work" />}{" "}
      received Applied Networking Research Prize (ANRP)
    </>
  ),
  createData(
    "November 2020",
    <>
      Our {<ItemLink link="https://dl.acm.org/doi/10.1145/3419394.3423664" name="IMC'20 work" />}{" "}
      received some media coverage on{" "}
      {
        <ItemLink
          link="https://www.zdnet.com/article/four-years-after-the-dyn-ddos-attack-critical-dns-dependencies-have-only-gone-up/"
          name="ZDNet"
        />
      }{" "}
      and{" "}
      {
        <ItemLink
          link="https://www.helpnetsecurity.com/2020/12/01/dns-spoofing/"
          name="Help Net Security"
        />
      }{" "}
    </>
  ),
  createData(
    "October 2020",
    <>
      Our paper on{" "}
      {
        <ItemLink
          link="https://dl.acm.org/doi/10.1145/3419394.3423664"
          name="Analyzing Third Party Service Dependencies in Modern Web Services: Have We Learned from
        the Mirai-Dyn Incident?"
        />
      }{" "}
      was accepted at IMC'20
    </>
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
