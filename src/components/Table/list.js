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
            tablenames: {},
            user_id: null,
            redir_table: null,
        }

        let setstate = (new_state) => { this.setState(new_state) };
        let is_admin = this.props.admin;

        this.props.firebase.auth.onAuthStateChanged(
            (user) => {
                let doc = is_admin ? this.props.firebase.fs.collection("users").doc(user.uid) : this.props.firebase.fs.collection("emails").doc(user.email);
                let key = is_admin ? "spreadSheetIDs" : "tables";

                doc.get().then((resp) => {
                    let ret = {
                        valid: resp.exists,
                        user_id: user.uid,
                    }
                    if (ret.valid) {
                        let data = resp.data();
                        ret.tables = data[key];
                    } else {
                    }

                    setstate(ret);

                    this.state.tables.forEach((key) => {
                        this.get_table_name(key).then((name) => {
                            setstate((state) => {
                                state.tablenames[key] = name;
                                return state;
                            })
                        })
                    }
                    )

                })

            });
    }

    async get_table_name(key) {
        let table = this.state.table_collection.doc(key);
        let resp = await table.get();
        if (resp.exists) {
            return resp.data().name;
        }
        return null;

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

        let user_doc = this.props.firebase.fs.collection("users").doc(this.state.user_id);
        let ret = { redir_table: new_doc.id };

        let setstate = (new_state) => { this.setState(new_state) };
        // Update user's tables
        user_doc.get().then((resp) => {
            let new_ls = resp.data().spreadSheetIDs;
            new_ls.push(new_doc.id);
            user_doc.update({
                spreadSheetIDs: new_ls,
            });
            setstate(ret);
        })

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
                return <li key={`table-${index}`}><Link to={`${this.props.admin ? ROUTES.TABLEADMIN : ROUTES.TABLE}/${table}`}>{this.state.tablenames[table] || table}</Link></li>
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