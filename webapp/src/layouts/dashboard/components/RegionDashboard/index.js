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

// @mui material components
import Card from "@mui/material/Card";
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GridItemCard from "./GridItemCard";

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
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-critical-rank.png" contentHeader="DNS Critical Dependency" contentBody="Critical DNS dependency for top 10K US-visited sites when measured from a US vantage point is 5% to 7% less than the top 10K Africa-visited websites. This gap incritical dependency increases to 6% to 10% in the more popular (top 1K) websites." sourceName="dns-critical-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-redundant-rank.png" contentHeader="DNS Redundancy" contentBody="The percentage of websites that are redundantly provisioned is slightly higher (2%) in the US-visited websites as compared to the Africa-visited websites. However, for more popular websites (top 1K), the percentage of redundantly provisioned US-visited websites is 5% to 7% higher than the Africa-visited websites." sourceName="dns-red-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/cdn-critical-rank.png" contentHeader="CDN Critical Dependency" contentBody="Critical CDN dependency for the top 10K US-visited sites is similar to the top 10K Africa-visited websites. However, for more popular websites, US-visited sites are 4% to 15% less critically dependent than Africa-visited websites." sourceName="cdn-critical-rank"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/ocsp-critical-rank.png" contentHeader="CA Critical Dependency" contentBody="Critical CA dependency for the top 10K US-visited sites, when measured from a US vantage point, is 7% to 12% less than the top 10K Africa-visited websites. This gap in critical dependency increases to 20% to 25% in the more popular (top 1K) websites." sourceName="ca-critical-rank"/>
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
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-dependency.png" contentHeader="DNS Critical and Redundant Dependency" contentBody="The figure shows the percentage of critically dependent websites on third-party DNS providers with the percentage of redundantly provisioned websites stacked on it. The height of the bar stack shows the percentage of websites using a third-party DNS provider. Third-party critical DNS dependency is highly prevalent (more than 90%) in Africa-centric websites when measured from all four vantage points. " sourceName="dns-dependency"/>
                  <GridItemCard xs={12} md={6} lg={6} imageName="africa/dns-critical-vantage.png" contentHeader="DNS Critical Dependency" contentBody="For each website set, the figure shows how critical dependency varies when moving from more popular (top 1K) websites to less popular (top 10K) ones for ZA and NG. Across all website sets, less popular websites are more critically dependent than more popular ones." sourceName="dns-critical-vantage"/>                </Grid>
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
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-usage.png" contentHeader="CDN Usage" contentBody="The figure shows the percentage of websites that use CDN in different website sets for each country. CDN usage is less in the specialized sets such as hosted, dominant, and operated as compared to the visited set except for ZA. " sourceName="cdn-usage"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-dependency.png" contentHeader="CDN Critical and Redundant Dependency" contentBody="The figure shows the percentage of critically dependent websites on third-party CDN providers with the percentage of redundantly provisioned websites stacked on it. The height of the bar stack shows the percentage of websites using a third-party CDN provider. Critical dependency on CDNs for Africa-centric websites is less prevalent as compared to critical DNS dependency." sourceName="cdn-dependency"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-critical-vantage.png" contentHeader="CDN Critical Dependency" contentBody="For each website set, the figure shows the change in critical dependency when moving from more popular (top 1K) websites to less popular (top 10K) ones for ZA and NG. Critical CDN dependency is lower for more popular websites, as compared to the less popular ones." sourceName="cdn-critical-vantage"/>
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
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/https-usage.png" contentHeader="HTTPS Usage" contentBody="The percentage of HTTPS support in websites is very high in Africa-centric websites, with the exception of the RW-hosted set." sourceName="https-usage"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ocsp-dependency.png" contentHeader="CA Critical Dependency and Stapling Enabled" contentBody="The figure shows the percentage of critically dependent websites on CA providers with the percentage of websites having stapling enabled stacked on them. Third-party CA critical dependency is less prevalent in Africa-centric websites as compared to DNS dependency. Moreover, KE and RW are less critically dependent in the hosted, dominant, and operated sets as compared to ZA and NG. " sourceName="ca-dependency"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ocsp-critical-vantage.png" contentHeader="CA Critical Dependency" contentBody="For each website set, the figure shows the change in critical CA dependency when moving from more popular (top 1K) websites to less popular (top 10K) ones for ZA and KE. Increase in popularity does not reduce critical CA dependency in Africa-centric websites. In fact, for KE (and also NG and RW), critical CA dependency increases when moving towards more popular websites." sourceName="ca-critical-vantage"/>                </Grid>
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
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/dns-cdf.png" contentHeader="DNS" contentBody="Concentration of DNS providers in ZA-visited and KE-visited is slightly higher than RW-visited , NG-visited and US-visited websites" sourceName="provider-dns"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/cdn-cdf.png" contentHeader="CDN" contentBody="The concentration of CDN providers in Africa-visited and US-visited websites is largely similar, with the concentration in US-visited websites being slightly higher" sourceName="provider-cdn"/>
                  <GridItemCard xs={12} md={4} lg={4} imageName="africa/ca-cdf.png" contentHeader="CA" contentBody="The concentration of CA providers in Africa-visited websites is slightly higher than the US-visited websites." sourceName="provider-ca"/>
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
