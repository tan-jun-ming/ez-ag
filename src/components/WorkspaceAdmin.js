import React, { Component } from 'react'

class WorkspaceAdmin extends Component {
    render() {
        return (
            <span>This is the admin page for {this.props.workspace_id}</span>
        );
    }
}

export default WorkspaceAdmin