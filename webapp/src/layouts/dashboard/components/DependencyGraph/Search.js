/* eslint-disable prettier/prettier */
// import React from "react";
// import Config from "./Config";

// function Search(props) {
//   const nodeDetails = useStoreState((state) => state.nodeDetails);
//   const setNodeDetails = useStoreActions((actions) => actions.setNodeDetails);
//   const searchTerm = useStoreState((state) => state.searchTerm);

//   const details = nodeDetails.map((node) => {
//     const type = node.nodeType;
//     const color = type == "Client" ? Config.ClientColor : Config.ProviderColor;
//     return (
//       <li key={node.id}>
//         <Text h6>Name: {node.label} </Text>
//         <Text h6>
//           Type: <Badge style={{ backgroundColor: color }}>{node.nodeType}</Badge>{" "}
//         </Text>
//         <Text h6>
//           Links: <Badge style={{ backgroundColor: color }}>{node.count}</Badge>{" "}
//         </Text>
//       </li>
//     );
//   });

//   return (
//     <>
//       <Text h5>Search or click on a node for details</Text>
//       <Input
//         icon={<Search />}
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={props.onSearchInputChange}
//         onClearClick={props.onClearClick}
//         clearable
//       />
//       <Spacer />
//       <Divider />
//       <ul>{details}</ul>
//     </>
//   );
// }

// export default Search;

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
import React from "react";
// @mui material components
import Card from "@mui/material/Card";
import SearchIcon from "@mui/icons-material/Search";
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import Config from "./Config"

function get_percentage(num, total) {
  console.log(total);
  return (num / total * 100).toFixed(2)
}
function Search(props) {
  const { searchTerm, searchResult, onSearchInputChange, heading, service, servicedep, totalClients } = props;
  console.log( totalClients)
  const searchResultList = searchResult.map((node) => {
    const isProvider = node.nodeType === "Provider";
    const color = isProvider ? Config.ProviderColor : Config.ClientColor;
    const letterAvatar = isProvider ? "P" : "W";
  
    return (
      <>
        <ListItem alignItems="flex-start" mb={3} key={node.id}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: color }}>{letterAvatar}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={node.label}
            secondary={<React.Fragment>
              {!isProvider &&  <Typography
                variant="body3"
                color={color}
              >
              {service=="ocsp" && `Stapling-enabled: ${node.stapling}`}
              {service=="ocsp" && <br></br>}
              {node.Third.size > 0 && `Third: ${[...node.Third].join(', ')}`}
              {node.Third.size > 0 && <br></br>}
              {node.Pvt.size > 0 && `Pvt: ${[...node.Pvt].join(', ')}`}
              
              </Typography>}
              {isProvider && <Typography
                variant="body2"
                color={color}
              >
                {`Type: ${node.type}`}
                <br></br>
                { `Concentration: ${node.conc.size}  (${get_percentage(node.conc.size,  totalClients)}%)`}
                <br></br>
                {node.type == "Third" && `Impact: ${node.impact.size}  (${get_percentage(node.impact.size,  totalClients)}%)`}
                <br></br>
                {service == "cdn" && `DNS: ${[...node.dns].join(', ')}`}
            </Typography>}
            {/* {
              () => {
                if(service == "cdn") {
                  servicedep.forEach(element => {
                    if(element.label.toLowerCase() == node) {
                      console.log("found")
                    }
                  });
                }
                return <br></br>
              }
            } */}
            </React.Fragment>}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </>
      
    )
  });

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Search a node for details
        </MDTypography>
        <MDBox mt={1} mb={2}>
          <MDInput
            value={searchTerm}
            label={
              <>
                <SearchIcon />
                Search
              </>
            }
            onChange={(e) => onSearchInputChange(e)}
          />
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <Typography mb={2} variant="h3">Top {searchResult.length} {heading}</Typography>
        <List>
          { searchResultList }
        </List>
      </MDBox>
    </Card>
  );
}

export default Search;
