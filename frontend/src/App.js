import React, { useEffect } from 'react'
import './App.css';
import { GeistProvider, CssBaseline, Page, Text } from '@geist-ui/react'
import { Switch, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Error, Graph, Home } from './views'
import { useStoreState, useStoreActions } from 'easy-peasy'

const App = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Page style={{width: "100%"}}>
        <NavBar />
        <Switch>
          <Route path={["/dns", "/cdn"]}>
            <Graph />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
          <Route component={Error} />
        </Switch>
      </Page>
    </GeistProvider>
  );
}

export default App;