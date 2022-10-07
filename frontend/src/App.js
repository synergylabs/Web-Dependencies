import React, { useEffect } from 'react'
import './App.css';
import { GeistProvider, CssBaseline, Page, Text } from '@geist-ui/react'
import { Switch, Route } from "react-router-dom";
import { NavBar } from "./components";
import { Error, Graph, Home } from './views'
import { useStoreState, useStoreActions } from 'easy-peasy'

const App = () => {
  const theme = useStoreState(state => state.theme)
  const toggleTheme = useStoreActions(actions => actions.toggleTheme)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleTheme('dark')
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      toggleTheme(newColorScheme)
    });

    return () => {
      window.removeEventListener('change',  e => {
        const newColorScheme = e.matches ? 'dark' : 'light';
        toggleTheme(newColorScheme)
      });
    }
  }, [])

  const myTheme = {
    "type": theme,
    "layout": {
      "pageWidth": "2400pt"
    }
  }

  return (
    <GeistProvider themes={[myTheme]} themeType={theme}>
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