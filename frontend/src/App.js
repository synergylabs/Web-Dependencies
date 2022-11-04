import React from 'react'
import './App.css';
import { GeistProvider, CssBaseline, Page } from '@geist-ui/react'
import { Switch, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Error, Graph, Home, About } from './views'

const App = () => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Page style={{width: "80%"}}>
        <Page.Header>
          <NavBar />
        </Page.Header>
        <Page.Content>
          <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path={["/dns", "/cdn", "/ca"]}>
            <Graph />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route component={Error} />
        </Switch>
        </Page.Content>
        <Page.Footer>
          <h2>Footer</h2>
        </Page.Footer>
      </Page>
    </GeistProvider>
  );
}

export default App;