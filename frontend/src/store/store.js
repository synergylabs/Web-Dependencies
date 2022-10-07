import { createStore, action, persist } from 'easy-peasy'

const store = createStore(persist({
	theme: 'light',
    toggleTheme: action((state, payload) => {
        state.theme = payload
    }),
    service: '',
    changeService: action((state, payload) => {
        state.service = String(payload).toLowerCase()
        state.node = null 
    }),
    graph: 'forceatlas2',
    changeGraph: action((state, payload) => {
        state.graph = String(payload)
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
    renderer: 'canvas',
    changeRenderer: action((state, payload) => {
        state.renderer = String(payload)
    }),
    refreshed: true,
    refresh: action((state, payload) => {
        state.refreshed = payload
    }),
    nodeDetails: null,
    setNodeDetails: action((state, payload) => {
        state.nodeDetails = payload
    }),
    showNodeDetails: false,
    toggleNodeDetails: action((state, payload) => {
        state.showNodeDetails = payload
    }),
}))

export default store;