import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import News from "./News";
import People from "./People";

export default function Home() {
  return (
    <DashboardLayout>
      <MDBox mb={4.5}>
        <Card>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <MDBox pt={3} px={2}>
              <MDTypography variant="h2" fontWeight="medium">
                Web Dependency
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
                vantage points in different regions and countries.
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
          </Stack>
        </Card>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}
