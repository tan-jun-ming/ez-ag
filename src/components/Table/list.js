import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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

    render() {
        if (this.state.valid === null) {
            return null;
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
                <li>
                    <button>Create New Table</button>
                </li>
            </ul>
        );
    }
}

const TableListPage = compose(
    withRouter,
    withFirebase,
)(TableListComponent);

export default TableListPage;