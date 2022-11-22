import React from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Text, Spacer, Select } from '@geist-ui/react'

const Home = () => {
    const renderer = useStoreState(state => state.renderer)
    const changeRenderer = useStoreActions(actions => actions.changeRenderer)
    const setDnsData = useStoreActions(actions => actions.setDnsData)
	return (
        <>
            <Text h2>Welcome to Web Dependencies home page!</Text>
        </>
	)
}

export default Home