import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import News from "./News";
import People from "./People";
import Publications from "./Publications";
import ItemLink from "./ItemLink";

export default function Home() {
  return (
    <DashboardLayout>
      <MDBox mb={4.5}>
        <Card>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <MDBox pt={3} px={2}>
              <MDTypography variant="h2" fontWeight="medium">
                Web Infrastructure Dependencies
              </MDTypography>
            </MDBox>
            <MDBox pt={3} px={2} width={0.8}>
              <Typography gutterbottom paragraph variant="body2" component="div">
                The websites we use everyday offload critical services such as name resolution
                (DNS), content distribution (CDN), and certificate issuance/revocation (CA) to third
                parties. As a result, the availability and security of these websites, and thus of
                our data and operations, depend on the availability and security of those third
                parties.
              </Typography>
              <Typography gutterbottom paragraph variant="body2" component="div">
                Third-party dependencies expose websites to shared risks and cascading failures, and
                the effects of such dependencies are routinely observed in the Internet today. To
                gauge the security risk that such dependencies entail, one needs to understand the
                prevalence of third-party dependencies across the websites that are important for
                users all over the world.
              </Typography>
              <Typography gutterbottom paragraph variant="body2" component="div">
                This website displays our existing measurement results on DNS, CDN, and CA from
                vantage points in different regions and countries. Please refer to our{" "}
                {
                  <ItemLink
                    link="https://dl.acm.org/doi/10.1145/3419394.3423664"
                    name="IMC'20 work"
                  />
                }{" "}
                for methodology.
              </Typography>
            </MDBox>
            <MDBox pt={3} px={2} width={0.8}>
              <Divider />
              <News />
            </MDBox>
            <Divider />
            <MDBox pt={3} px={2} width={0.8}>
              <Divider />
              <People />
            </MDBox>
            <MDBox pt={3} px={2} width={0.8}>
              <Divider />
              <Publications />
            </MDBox>
          </Stack>
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}
