import React, { Component } from 'react'

class Workspace extends Component {
    render() {
        return (
            <div>You are viewing Workspace {this.props.match.params.id}</div>
        );
    }
}

export default Workspace