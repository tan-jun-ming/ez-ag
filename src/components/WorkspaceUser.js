import React, { Component } from 'react'

class WorkspaceUser extends Component {
    render() {
        return (
            <span>This is the user page for {this.props.workspace_id}</span>
        );

    }
}

export default WorkspaceUser