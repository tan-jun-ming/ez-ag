import React, { Component } from 'react'

class WorkspaceUser extends Component {
    render() {
        return (
            <div>
                <h2>You are viewing {this.props.workspace_id} as user</h2>
                <span>Add workflow editing here.</span>
            </div>
        );

    }
}

export default WorkspaceUser