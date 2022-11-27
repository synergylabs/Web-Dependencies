/* eslint-disable react/prop-types */
import React from "react";

export default class SigmaLoader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    this._load(this.props.graph);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.graph !== this.props.sigma.graph) {
      this.setState({ loaded: false });
      this._load(props.graph);
    }
  }

  embedProps(elements, extraProps) {
    return React.Children.map(elements, element =>
      React.cloneElement(element, extraProps)
    );
  }

  render() {
    if (!this.state.loaded) return null;
    return (
      <div>
        {this.embedProps(this.props.children, { sigma: this.props.sigma })}
      </div>
    );
  }

  _load(graph) {
    const sigma = this.props.sigma
    if (graph && typeof sigma != "undefined") {
      sigma.graph.clear();
      sigma.graph.read(graph);
    
      const nodes = sigma.graph.nodes();
      for(let i = 0; i < nodes.length; i++) {
        const degree = sigma.graph.degree(nodes[i].id);
        nodes[i].size = degree;
      }

      sigma.refresh();
    }
    this.setState({ loaded: true });
  }
}