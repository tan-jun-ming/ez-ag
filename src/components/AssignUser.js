import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

class AssignUser extends Component {
    render() {

        // get user id from session
        // determine users in workspace
        // Implement Add button

        let users = [
            this.renderUser("1234"),
            this.renderUser("5678"),
            this.renderUser("9012")
        ];

        return (
            <div>
                <h2>Users for {this.props.match.params.id}</h2>
                <ListGroup vertical>
                    {users}
                </ListGroup>
            </div>
        );
    }
    renderUser(user_id) {
        return <UserListItem user_id={user_id} />
    }
}

class UserListItem extends Component {
    state = {
        redirect: ""
    }




    render() {
        // TODO: manage user invites ig
        // ensure admin can view user's details

        // get user name & email from id

        let user_id = this.props.user_id;
        let user_name = "John Smith";
        let user_email = "jsmith@example.com"

        return (
            <ListGroup.Item>
                <span>
                    {`${user_name} ${user_email} (${user_id})`}
                </span>
            </ListGroup.Item>
        )
    }
}

export default AssignUser;