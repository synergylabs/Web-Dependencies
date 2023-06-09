import * as React from "react";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
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
        <Link
          href="https://www.andrew.cmu.edu/user/akashaf/assets/files/Webdep-africa.pdf"
          color="info"
        >
          A First Look at Third Party Service Dependencies in Africa
        </Link>
      }{" "}
      was accepted at PAM'23
    </>
  ),
  createData(
    "November 2020",
    <>
      Our paper on{" "}
      {
        <Link href="https://www.andrew.cmu.edu/user/akashaf/assets/files/Webdep.pdf" color="info">
          Analyzing Third Party Service Dependencies in Modern Web Services: Have We Learned from
          the Mirai-Dyn Incident?
        </Link>
      }{" "}
      was accepted at IMC'20 and received ANRP reward
    </>
  ),
  createData(
    "November 2020",
    <>
      Our paper on{" "}
      {
        <Link href="https://www.andrew.cmu.edu/user/akashaf/assets/files/Webdep.pdf" color="info">
          Analyzing Third Party Service Dependencies in Modern Web Services: Have We Learned from
          the Mirai-Dyn Incident?
        </Link>
      }{" "}
      was accepted at IMC'20 and received ANRP reward
    </>
  ),
];

export default function News() {
  return (
    <>
      <MDTypography variant="h3" fontWeight="medium">
        Publications
      </MDTypography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }} disablePadding>
          <ListItemButton
            component="a"
            href="https://www.andrew.cmu.edu/user/akashaf/assets/files/Webdep-africa.pdf"
            target="_blank"
          >
            <ListItemText
              primary="A First Look at Third Party Service Dependencies in Africa"
              secondary={
                <>
                  Kashaf, Aqsa, Jiachen Dou, Maragrita Belova, Maria Apostolaki, Vyas Sekar, and
                  Yuvraj Agarwal
                  <br />
                  <i>In Proceedings of the Passive and Active Measurement Conference (PAM) 2023</i>
                </>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ display: "list-item" }} disablePadding>
          <ListItemButton
            component="a"
            href="https://dl.acm.org/doi/10.1145/3419394.3423664"
            target="_blank"
          >
            <ListItemText
              primary="Analyzing Third Party Service Dependencies in Modern Web Services: Have We Learned from
        the Mirai-Dyn Incident?"
              secondary={
                <>
                  Kashaf, Aqsa, Vyas Sekar, and Yuvraj Agarwal
                  <br />
                  <i>In Proceedings of the ACM Internet Measurement Conference (IMC) 2020</i>
                </>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
