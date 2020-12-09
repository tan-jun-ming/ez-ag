import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import strftime from 'strftime';
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

        this.props.firebase.auth.onAuthStateChanged(
            (user) => {

                let ret = {
                    valid: true,
                }

                this.state.user_collection.doc(user.uid).get().then((resp) => {
                    ret.last_seen = resp.data().last_seen;
                    this.state.tables_collection.where("owner", "==", user.uid).get().then((resp2) => {
                        let tables = [];
                        let tablenames = {};
                        resp2.forEach((doc) => {
                            tables.push(doc.id);
                            tablenames[doc.id] = doc.data().name;
                        })

                        if (tables.length > 0) {
                            this.state.tabledata_collection.where("table", "in", tables).get().then((resp3) => {
                                ret.tabledata_insts = [];
                                resp3.forEach((doc) => {
                                    let data = doc.data();
                                    if (data.last_updated != 0) { // Somehow can't query this
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
                                    }
                                })

                                ret.tabledata_insts.sort((a, b) => {
                                    if (a.last_updated < b.last_updated) return 1;
                                    if (a.last_updated > b.last_updated) return -1;
                                    return 0;
                                });

                                setstate(ret);
                            })
                        } else {
                            setstate(ret);
                        }

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
                    <TableInstance
                        table={table.table}
                        user={table.user}
                        email={table.email}
                        date={table.date}
                        block={table.block}
                        table_name={table.table_name}
                        last_updated={table.last_updated}
                    />
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

const TableInstance = (props) => {
    return (
        <Link to={`${ROUTES.TABLEVIEW}/${props.table}/${props.user}/${props.date}/${props.block}`}>
            <div className = 'card'>
                <h3>
                    {props.table_name}
                </h3>
                <p>
                    {props.date} Block {props.block} <br/>
                    Last Updated {strftime("%B %d, %Y %H:%M:%S", new Date(props.last_updated))} <br/>
                    by {props.email}
                </p>
            </div>
        </Link>
    )
}

const TableUpdates = compose(
    withRouter,
    withFirebase,
)(TableUpdatesComponent);

export default TableUpdates;