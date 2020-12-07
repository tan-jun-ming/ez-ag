import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class TableUpdatesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            valid: null,
            tables_collection: this.props.firebase.fs.collection("tables"),
            tabledata_collection: this.props.firebase.fs.collection("tabledata"),
            user_collection: this.props.firebase.fs.collection("users"),
            last_seen: 0,
            tabledata_insts: [],
        }

        let setstate = (new_state) => { this.setState(new_state) };
        let is_admin = this.props.admin;
        console.log(is_admin);

        this.props.firebase.auth.onAuthStateChanged(
            (user) => {

                let ret = {
                    valid: true,
                }
                if (is_admin) {
                    ret.valid = false;
                    setstate(ret);
                    return;
                }

                this.state.user_collection.doc(user.uid).get().then((resp) => {
                    ret.last_seen = resp.data().last_seen;
                    this.state.tables_collection.where("owner", "==", user.uid).get().then((resp) => {
                        let tables = [];
                        let tablenames = {};
                        resp.forEach((doc) => {
                            tables.push(doc.id);
                            tablenames[doc.id] = doc.data().name;
                        })

                        this.state.tabledata_collection.where("table", "in", tables).get().then((resp) => {
                            resp.forEach((doc) => {
                                let data = doc.data();
                                ret.tabledata_insts.push(
                                    {
                                        last_updated: data.last_updated,
                                        table_name: tablenames[data.table],
                                        email: data.email,
                                        table: data.table,
                                        user: data.user,
                                        date: data.date,
                                        block: data.block
                                    });
                            })

                            ret.tabledata.sort((a, b) => {
                                if (a.last_updated < b.last_updated) return -1;
                                if (a.last_updated > b.last_updated) return 1;
                                return 0;
                            });

                            setstate(ret);
                        }
                        )

                    }
                    )

                })



            });
    }

    render() {
        if (this.state.valid === null) {
            return null;
        }

        let ret = this.state.tabledata_insts.map(
            (table, index) => {
                return <li key={`table-${index}`}>
                    <Link to={`${ROUTES.TABLEVIEW}/${table.table}/${table.user}/${table.date}/${table.block}`}>
                        <ul>
                            <li>
                                {table.table_name}
                            </li>
                            <li>
                                {table.date} Block {table.block}
                            </li>
                            <li>
                                Last Updated {table.last_updated} by {table.email}
                            </li>
                        </ul>
                    </Link>
                </li >
            }
        )
        return (
            <ul className="table-list">
                {ret}
            </ul>
        );
    }
}

const TableUpdates = compose(
    withRouter,
    withFirebase,
)(TableUpdatesComponent);

export default TableUpdates;