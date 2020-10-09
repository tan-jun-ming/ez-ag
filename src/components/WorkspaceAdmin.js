import React, { Component } from 'react'

class WorkspaceAdmin extends Component {
    render() {
        return (
            <div>
                <h2>You are viewing {this.props.workspace_id} as admin</h2>
                <ul>
                    <li><a href={this.props.workspace_id + "/users"}>Assign Users</a></li> {/* TODO: make this redirect in a proper fashion */}
                    <li><a href="#">Assign Workflows</a></li>
                </ul>
            </div>

        );
    }
}

export default WorkspaceAdmin