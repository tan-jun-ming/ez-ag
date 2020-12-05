import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class TableListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            valid: null,
            table_collection: this.props.firebase.fs.collection("tables"),
            tables: [],
            user_id: null,
            redir_table: null,
        }

        let setstate = (new_state) => { this.setState(new_state) };
        let is_admin = this.props.admin;

        this.props.firebase.auth.onAuthStateChanged(
            (user) => {
                let db = this.props.firebase.fs.collection("tables")

                if (is_admin) {
                    db = db.where("owner", "==", user.uid);
                } else {
                    db = db.where("users", "array-contains", user.email);
                }

                db.get().then((resp) => {
                    let ret = {
                        valid: true,
                        user_id: user.uid,
                        tables: [],
                    }
                    resp.forEach((doc) => {
                        ret.tables.push([doc.id, doc.data().name]);

                    })
                    setstate(ret);
                })



            });
    }

    new_table() {
        let new_doc = this.props.firebase.fs.collection("tables").doc();
        new_doc.set({
            columns: [],
            rows: [],
            data: [],
            name: "Untitled Spreadsheet",
            owner: this.state.user_id,
            users: [],
        });

        let ret = { redir_table: new_doc.id };

        this.setState(ret)

    }

    render() {
        if (this.state.valid === null) {
            return null;
        } else if (
            this.state.redir_table !== null) {
            return <Redirect to={`${this.props.admin ? ROUTES.TABLEADMIN : ROUTES.TABLE}/${this.state.redir_table}`} />
        }
        // console.log(this.state)
        let ret = this.state.tables.map(
            (table, index) => {
                return <li key={`table-${index}`}><Link to={`${this.props.admin ? ROUTES.TABLEADMIN : ROUTES.TABLE}/${table[0]}`}>{table[1]}</Link></li>
            }
        )
        return (
            <ul>
                {ret}
                {this.props.admin &&
                    <li>
                        <button onClick={this.new_table.bind(this)}>Create New Table</button>
                    </li>
                }
            </ul>
        );
    }
}

const TableListPage = compose(
    withRouter,
    withFirebase,
)(TableListComponent);

export default TableListPage;