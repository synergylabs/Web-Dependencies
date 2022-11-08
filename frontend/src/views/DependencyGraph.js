import React from 'react'
import { Card, Grid, Text } from '@geist-ui/react'
import { Graph } from '.'

const DependencyGraph = () => {
	return (
        <>
            <Grid.Container gap={2} justify="center">
                <Grid xs={6}>
                    <Grid.Container gap={1} justify="center">
                        <Grid xs={24}><Card shadow width="100%" ><Text h2>Search</Text></Card></Grid>
                        <Grid xs={24}><Card shadow width="100%" ><Text h2>Results</Text></Card></Grid> 
                    </Grid.Container>
                </Grid>
                <Grid xs={17}><Card shadow width="100%" ><Graph /></Card></Grid>
            </Grid.Container>
        </>
	)
}

export default DependencyGraph