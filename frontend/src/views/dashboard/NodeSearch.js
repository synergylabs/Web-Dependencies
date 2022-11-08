import React from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Badge, Text, Spacer, Input } from '@geist-ui/react'
import Search from '@geist-ui/react-icons/search'

const NodeSearch = () => {
    const nodeDetails = useStoreState(state => state.nodeDetails)
    const client_color = '#003366'
    const provider_color = '#33c0c0' 

    const details = nodeDetails.map(node => {
        const type = node.nodeType
        const color = type == 'Client' ? client_color : provider_color
        return (
            <>
                <Text h6>Name: {node.label} </Text>
                <Text h6>Type: <Badge style={{ backgroundColor: color }}>{node.nodeType}</Badge> </Text>
                <Text h6>Links: <Badge style={{ backgroundColor: color }}>{node.val}</Badge> </Text>
            </>
            
        )
    })

	return (
        <>
            <Text h5>Click on a node for details</Text>
            <Spacer />
            { details }
        </>
	)
}

export default NodeSearch