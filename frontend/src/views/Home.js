import React from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Text, Spacer, Select } from '@geist-ui/react'

const Home = () => {
    const renderer = useStoreState(state => state.renderer)
    const changeRenderer = useStoreActions(actions => actions.changeRenderer)

	return (
        <>
            <Text h5>Click any one of the services above to view their respective graphs</Text>
            <Spacer />
            <Text>Select Renderer</Text>
            <Select initialValue={renderer} onChange={value => changeRenderer(value)}>
                <Select.Option value="webgl">WebGL (faster)</Select.Option>
                <Select.Option value="canvas">Canvas (fancier)</Select.Option>
            </Select>
        </>
	)
}

export default Home