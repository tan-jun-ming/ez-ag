import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import "./Workspace.scss";
import { Redirect } from 'react-router-dom';

class Workspace extends Component {
    render() {

        console.log("Rendering Workspace!");

        return (
            // probably get all workspaces here

            <ListGroup horizontal>
                {this.renderBadge("Users", '/user')}
                {this.renderBadge("WS 2", '/admin')}
                {this.renderBadge("WS 3",'')}
            </ListGroup>
        );
    }
    renderBadge(name, route) {
        return <WorkspaceBadge value={name} route={route} />
    }
}

class WorkspaceBadge extends Component {
    state = {
        redirect: ""
    }

    render() {

        console.log('Rendering Badge!');
        console.log(this.state, this.props);

        const { redirect }  = this.state;

        if (redirect != "") {
            return <Redirect to={this.props.route} />
        }

        return (
            <ListGroup.Item>
                <button 
                    className="btn btn-primary badge" 
                    onClick={() => {
                        //alert(`${this.props.value} clicked`)
                        if (this.props.route != '') {
                            this.setState({redirect: this.props.route})
                        }
                    }}
                >
                    {this.props.value}
                </button>
            </ListGroup.Item>
        )
    }
}

export default Workspace;