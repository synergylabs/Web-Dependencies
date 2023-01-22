/* eslint-disable prettier/prettier */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState } from "react";

// @mui material components
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GridItemCard from "./GridItemCard";
import Footer from "examples/Footer";

const RegionDashboard = (props) => {
  const {region, title} = props;

  return (
    <DashboardLayout>
      <DashboardNavbar title={title}/>
      <MDBox py={3}>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                Critical Dependency and Redundancy
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the portion of US-visited , ZA-visited , NG-visited , RW-visited and KE-visited websites with different popularity (top 1K and 10K) that are critically dependent or redundantly provisioned as a function of the particular service and as measured by vantage
points that are in the corresponding region. 
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-critical-rank.png" contentHeader="DNS Critical Dependency" sourceName="dns-critical-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-redundant-rank.png" contentHeader="DNS Redundancy" sourceName="dns-redundant-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/cdn-critical-rank.png" contentHeader="CDN Critical Dependency" sourceName="cdn-critical-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/ocsp-critical-rank.png" contentHeader="CA Critical Dependency" sourceName="ca-critical-rank"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                DNS Dependency
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the portion of websites with Third-party DNS providers dependency in African countries.
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-dependency.png" contentHeader="DNS Critical and Redundant Dependency" sourceName="dns-dependency"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-critical-vantage.png" contentHeader="DNS Critical Dependency" sourceName="dns-critical-vantage"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                CDN Dependency
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the portion of websites with CDN usage and Third-party CDN providers dependency in African countries.
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-usage.png" contentHeader="CDN Usage" sourceName="cdn-usage"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-dependency.png" contentHeader="CDN Critical and Redundant Dependency" sourceName="cdn-dependency"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-critical-vantage.png" contentHeader="CDN Critical Dependency" sourceName="cdn-critical-vantage"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                CA Dependency
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the portion of websites with HTTPS usage and Third-party CA providers dependency in African countries.
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/https-usage.png" contentHeader="HTTPS Usage" sourceName="https-usage"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ocsp-dependency.png" contentHeader="CA Critical Dependency and Stapling Enabled" sourceName="ca-dependency"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ocsp-critical-vantage.png" contentHeader="CA Critical Dependency" sourceName="ca-critical-vantage"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                Provider Concentration
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the cumulative fraction of websites for a given number of DNS, CDN and CA providers in African countries and US. 
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/dns-cdf.png" contentHeader="DNS" sourceName="provider-dns"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-cdf.png" contentHeader="CDN" sourceName="provider-cdn"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ca-cdf.png" contentHeader="CA" sourceName="provider-ca"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        <MDBox mb={4.5}>
          <Card>
            <MDBox pt={3} px={2}>
              <MDTypography variant="h3" fontWeight="medium">
                Dataset Relationship Diagrams
              </MDTypography>
              <Typography variant="body2" color="text.secondary">
              The figures show the relationship between different website sets for Kenya, Nigeria, Rwanda, and South Africa. The visited set is the super-set of all the other sets.
              </Typography>
            </MDBox>
            <MDBox pt={1} pb={2} px={2}>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                <Grid container spacing={3}>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/ke-venn.png" contentHeader="Kenya" sourceName="dataset-ke"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/ng-venn.png" contentHeader="Nigeria" sourceName="dataset-ng"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/rw-venn.png" contentHeader="Rwanda" sourceName="dataset-rw"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/za-venn.png" contentHeader="South Africa" sourceName="dataset-za"/>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default RegionDashboard;
