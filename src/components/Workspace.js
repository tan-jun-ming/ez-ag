import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import "./Workspace.scss";

class Workspace extends Component {
    render() {
        return (
            // probably get all workspaces here

            <ListGroup horizontal>
                {this.renderBadge("WS 1")}
                {this.renderBadge("WS 2")}
                {this.renderBadge("WS 3")}
            </ListGroup>
        );
    }
    renderBadge(name) {
        return <WorkspaceBadge value={name} />
    }
}

class WorkspaceBadge extends Component {
    render() {
        return (
            <ListGroup.Item>
                <button className="btn btn-primary badge" onClick={() => alert(`${this.props.value} clicked`)}>
                    {this.props.value}
                </button>
            </ListGroup.Item>
        )
    }
}

export default Workspace;