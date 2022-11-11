import React from 'react'
import Config from './Config'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Badge, Divider, Text, Spacer, Input } from '@geist-ui/react'
import Search from '@geist-ui/react-icons/search'

const NodeSearch = (props) => {
    const nodeDetails = useStoreState(state => state.nodeDetails)
    const setNodeDetails = useStoreActions(actions => actions.setNodeDetails)
    const searchTerm = useStoreState(state => state.searchTerm)

    const details = nodeDetails.map(node => {
        const type = node.nodeType
        const color = type == 'Client' ? Config.ClientColor : Config.ProviderColor
        return (
            <li key={node.id}>
                <Text h6>Name: {node.label} </Text>
                <Text h6>Type: <Badge style={{ backgroundColor: color }}>{node.nodeType}</Badge> </Text>
                <Text h6>Links: <Badge style={{ backgroundColor: color }}>{node.count}</Badge> </Text>
            </li>
            
        )
    })

    const onClearClick = () => {
        setNodeDetails([])
    }

	return (
        <>
            <Text h5>Search or click on a node for details</Text>
            <Input
                icon={<Search />}
                placeholder="Search..."
                value={searchTerm}
                onChange={props.onSearchInputChange}
                onClearClick={onClearClick}
                clearable
            />
            <Spacer />
            <Divider />
            <ul>{ details }</ul>
            
        </>
	)
}

export default NodeSearch