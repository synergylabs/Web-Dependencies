import { createStore, action, persist } from 'easy-peasy'

const store = createStore(persist({
    dnsData: {nodes: [], links: []},
    setDnsData: action((state, payload) => {
        state.dnsData = payload
    }),
    service: '',
    changeService: action((state, payload) => {
        state.service = String(payload).toLowerCase()
        state.node = null 
    }),
    node: null,
    setNode: action((state, payload) => {
        state.node = payload
        state.searchTerm = ''
    }),
    searchTerm: '',
    setTerm: action((state, payload) => {
        state.searchTerm = String(payload).toLowerCase()
    }),
    nodeDetails: [],
    setNodeDetails: action((state, payload) => {
        state.nodeDetails = payload
    }),
    showNodeDetails: false,
    toggleNodeDetails: action((state, payload) => {
        state.showNodeDetails = payload
    }),
}))

export default store;