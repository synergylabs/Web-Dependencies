import React from 'react';
import { Link } from 'react-router-dom'
import { Tabs, Text } from '@geist-ui/react'
import { Globe, Server } from '@geist-ui/react-icons'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useHistory, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();
    const history = useHistory();
    
    return (
        <>
            <Link to='/'><Text h3>Web Dependencies</Text></Link>
            <Tabs value={location.pathname} onChange={(route) => history.push(route)} hoverHeightRatio={5}>
                <Tabs.Item label="Home" value="/" />
                <Tabs.Item label="DNS" value="/dns" />
                {/* <Tabs.Item label="CDN" value="/cdn" />
                <Tabs.Item label="CA" value="/ca" /> */}
                <Tabs.Item label="About" value="/about" />
            </Tabs>
        </>
    )
}

export default NavBar;
