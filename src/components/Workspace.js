import React, { Component } from 'react'
import WorkspaceUser from './WorkspaceUser';
import WorkspaceAdmin from './WorkspaceAdmin';

class Workspace extends Component {
    render() {
        let is_admin = true;
        // determine if the user is user or admin
        if (is_admin) {
            return (<WorkspaceAdmin workspace_id={this.props.match.params.id} />);
        } else {
            return (<WorkspaceUser workspace_id={this.props.match.params.id} />);
        }
        return (
            <div>You are viewing Workspace {this.props.match.params.id}</div>



        );
    }
}

export default Workspace