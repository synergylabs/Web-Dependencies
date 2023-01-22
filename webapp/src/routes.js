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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React layouts
import CountryDashboard from "layouts/dashboard/components/CountryDashboard";
import RegionDashboard from "layouts/dashboard/components/RegionDashboard";

// @mui icons
import ReactCountryFlag from "react-country-flag"

const routes = [
  {
    type: "divider",
  },
  {
    type: "title",
    name: "Regions",
    title: "Regions",
    key: "regions",
  },
  {
    type: "collapse",
    name: "Africa",
    key: "af",
    icon: <MDAvatar variant="circular" size="sm">AF</MDAvatar>,
    route: "/region/af",
    component: <RegionDashboard region="us" title="Africa" />,
  },
  {
    type: "divider",
  },
  {
    type: "title",
    name: "Countries",
    title: "Countries",
    key: "countries",
  },
  {
    type: "collapse",
    name: "United States",
    key: "us",
    icon: <ReactCountryFlag countryCode="US"/>,
    route: "/country/us",
    component: <CountryDashboard country="us" title="United States"/>,
  },
  {
    type: "collapse",
    name: "Kenya",
    key: "ke",
    icon: <ReactCountryFlag countryCode="KE"/>,
    route: "/country/ke",
    component: <CountryDashboard country="ke" title="Kenya"/>,
  },
  {
    type: "collapse",
    name: "Nigeria",
    key: "ng",
    icon: <ReactCountryFlag countryCode="NG"/>,
    route: "/country/ng",
    component: <CountryDashboard country="ng" title="Nigeria"/>,
  },
  {
    type: "collapse",
    name: "Rwanda",
    key: "/rw",
    icon: <ReactCountryFlag countryCode="RW"/>,
    route: "/country/rw",
    component: <CountryDashboard country="rw" title="Rwanda"/>,
  },
  {
    type: "collapse",
    name: "South Africa",
    key: "za",
    icon: <ReactCountryFlag countryCode="ZA"/>,
    route: "/country/za",
    component: <CountryDashboard country="za" title="South Africa"/>,
  },
];

export default routes;
