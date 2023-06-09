import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { PeopleCard } from "./PeopleCard";

function createData(name, email, link, photo) {
  return { name, email, link, photo };
}

const rows = [
  createData(
    "Aqsa Kashaf",
    "akashaf@cmu.edu",
    "https://www.andrew.cmu.edu/user/akashaf/",
    "akashaf"
  ),
  // createData("Jiachen Dou", "jiachend@alumni.cmu.edu", "https://www.linkedin.com/in/jasondou22/"),
  createData(
    "Maria Apostolaki",
    "apostolaki@princeton.edu",
    "https://netsyn.princeton.edu/people/maria-apostolaki",
    "mapostolaki"
  ),
  createData(
    "Yuvraj Agarwal",
    "yuvraj@cs.cmu.edu",
    "https://www.synergylabs.org/yuvraj/",
    "yagarwal"
  ),
  createData("Vyas Sekar", "vsekar@andrew.cmu.edu", "http://users.ece.cmu.edu/~vsekar/", "vsekar"),
];

export default function People() {
  return (
    <>
      <MDTypography variant="h3" fontWeight="medium">
        People
      </MDTypography>
      <MDBox pt={2} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <Grid container spacing={4}>
            {rows.map((person) => (
              <PeopleCard
                name={person.name}
                email={person.email}
                link={person.link}
                photo={person.photo}
              />
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </>
  );
}
