import React, { Component } from 'react';

class TableUsersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: this.props.users,
            textbox: "",
        }
    }

    update_users(new_list) {
        this.props.doc.update({
            users: new_list,
        });

        this.setState({ users: new_list, textbox: "" });

    }

    add_user() {
        if (this.state.textbox) {
            let users = this.state.users.slice();
            users.push(this.state.textbox);
            this.update_users(users);
        }
    }

    remove_user(index) {
        let users = this.state.users.slice();
        users.splice(index, 1);
        this.update_users(users);
    }

    onSubmit(event) {
        this.add_user();
        event.preventDefault();
        return false;
    }
    render() {
        let ret = this.state.users.map((email, index) => {
            return (
                <li key={`user-${index}`}>
                    {email}
                    <button className="close-button userlistitem-btn" onClick={this.remove_user.bind(this, index)}>
                        X
                    </button>
                </li>);
        });

        return (
            <div>
                <h1>
                    Manage Users
                </h1>
                <button className="close-button userlist-btn" onClick={this.props.closemodal}>
                    X
                </button>
                <ul>
                    {ret}
                    <li>
                        <form onSubmit={this.onSubmit.bind(this)}>
                            <input value={this.state.textbox} onChange={(event) => { this.setState({ textbox: event.target.value }) }}></input>
                            <button type="submit">Add</button>

                        </form>
                    </li>
                </ul>
            </div>
        );
    }
}

export default TableUsersList;