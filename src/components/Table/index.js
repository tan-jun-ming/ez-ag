import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { Parser as FormulaParser } from 'hot-formula-parser';
import { withFirebase } from '../Firebase';
import './Tables.scss'
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';


const TableUser = (props) => (
    <AuthUserContext.Consumer>
        {authUser => (
            <TableComponent authUser={authUser} {...props} />
        )}
    </AuthUserContext.Consumer>
);

class TableComponent extends Component {
    constructor(props) {
        super(props);
        let document = this.props.firebase.fs.collection("tables").doc(this.props.id);
        this.state = {
            document: document,
            data_document: null,
            valid: null,
            columns: [],
            rows: [],
            data: [], // columns, rows
            ndate: null,
            nblock: null,
            redirect: false,
            dynamic_data: [], // columns, rows (not populated in edit mode)
            owner: null,
            users: [],
            current_user: null,
            table_name: null,
        }
        // TODO: validate the date for the url and the prop block

        let date = this.props.date;
        let block = this.props.block;
        let deserialize_data = this.deserialize_data
        let setstate = (new_state) => { this.setState(new_state) };

        this.props.firebase.auth.onAuthStateChanged(
            (user) => {
                let data_document_id = `${this.props.id}-${user.uid}-${date}-${block}`;
                document.get().then((resp) => {
                    let ret = {
                        current_user: user,
                        valid: resp.exists
                    }
                    if (ret.valid) {
                        let data = resp.data();
                        ret.owner = data.owner;
                        ret.users = data.users;

                        // Validate if user can view current page
                        if ((this.props.edit_mode && ret.owner !== user.uid) ||
                            ((!this.props.edit_mode) && (!ret.users.includes(user.email)))) {
                            ret.valid = false;
                            setstate(ret);
                            return;
                        }

                        ret.table_name = data.name;
                        ret.columns = data.columns.map((col) => { return TableColumn.from(col) });
                        ret.rows = data.rows.map((row) => { return TableRow.from(row) });
                        ret.data = deserialize_data(data.data);

                        ret.dynamic_data = new Array(ret.rows.length).fill(null).map(() => new Array(ret.columns.length).fill(null));

                        console.log(data_document_id)
                        ret.data_document = this.props.firebase.fs.collection("tabledata").doc(data_document_id);
                        ret.data_document.get().then((resp2) => {
                            if (resp2.exists) {
                                console.log("filling data")
                                let dyn_data = deserialize_data(resp2.data().data);

                                for (let y = 0; y < dyn_data.length; y++) {
                                    for (let x = 0; x < dyn_data[0].length; x++) {
                                        ret.dynamic_data[y][x] = dyn_data[y][x];
                                    }
                                }
                            } else {
                                ret.data_document.set({
                                    data: deserialize_data(ret.dynamic_data)
                                })
                            }
                            setstate(ret);
                        }).catch(error => {
                            console.log(error);
                        });

                    } else {
                        setstate(ret);
                    }

                })
                    .catch(error => {
                        console.log(error);
                    });
            }
        )


    }

    _cell_is_formula(value) {
        return value != null && String(value).startsWith("=");
    }

    process_spreadsheet() {
        let data = JSON.parse(JSON.stringify(this.state.data)); // I hate how theres no good deepcopy in js

        // Flatten data & dynamic data before proceeding
        for (let x = 0; x < this.state.columns.length; x++) {
            for (let y = 0; y < this.state.rows.length; y++) {
                if (!data[y][x]) {
                    data[y][x] = this.state.dynamic_data[y][x]
                }
            }
        }

        for (let x = 0; x < this.state.columns.length; x++) {
            for (let y = 0; y < this.state.rows.length; y++) {
                if (typeof data[y][x] == "string" && !isNaN(data[y][x]) && !isNaN(parseFloat(data[y][x]))) {
                    data[y][x] = Number(data[y][x]);
                }

                let curr_cell = data[y][x];
                if (this._cell_is_formula(curr_cell)) {
                    this.resolve_cell(x, y, new Set(), data, this._cell_is_formula, this.resolve_cell);
                }
            }
        }
        return data;
    }

    resolve_cell(x, y, state, data, formula_check_func, resolve_func) {
        console.log("resolve cell called", x, y, state)
        let ret = "#REF!";
        if (!state.has(`${x},${y}`)) {
            state.add(`${x},${y}`);

            let curr_parser = new FormulaParser();

            curr_parser.on("callCellValue", function (cellCoord, done) {
                try {
                    console.log(cellCoord)
                    let new_x = cellCoord.column.index;
                    let new_y = cellCoord.row.index;

                    let curr_cell = data[new_y][new_x];
                    console.log(curr_cell);

                    if (formula_check_func(curr_cell)) {
                        // console.log("calling resolve cell.....");
                        resolve_func(new_x, new_y, state, data, formula_check_func, resolve_func);
                        curr_cell = data[new_y][new_x];
                    }

                    done(curr_cell);
                } catch (error) {
                    console.error(error)
                }
            });

            curr_parser.on("callRangeValue", function (startCellCoord, endCellCoord, done) {
                try {
                    if (startCellCoord.label === "B1" && endCellCoord.label === "B3") {
                        done([[1], [2], [3]]);
                        return;
                    }
                    let ret = [];

                    for (let i = startCellCoord.row.index; i <= endCellCoord.row.index; i++) {

                        let row_ret = [];

                        for (let u = startCellCoord.column.index; u <= endCellCoord.column.index; u++) {
                            let curr_cell = data[i][u];
                            if (formula_check_func(curr_cell)) {
                                resolve_func(x, y, new Set(), data, formula_check_func, resolve_func);
                                curr_cell = data[i][u];
                            }
                            row_ret.push(curr_cell);
                        }
                        ret.push(row_ret);
                    }

                    console.log(ret);
                    done(ret);
                } catch (error) {
                    console.error(error)
                }
            }


            );

            let result = curr_parser.parse(String(data[y][x]).substr(1));

            if (result.error === null) {
                ret = result.result;
            } else {
                ret = String(result.error);
            }
        }

        console.log(x, y, typeof ret)
        data[y][x] = ret;

    }

    serialize_data(data) {
        return data.map((dt) => {
            return {
                0: dt,

            }
        });
    }

    deserialize_data(data) {
        return data.map((dt) => {
            return dt ? dt[0] : [];
        });
    }

    serialize_headers(headers) {

        return headers.map((dt) => {
            return dt.serialize();

        });
    }

    addCol(isStatic) {
        if (!this.props.edit_mode) {
            return;
        }

        const columns = this.state.columns.slice();
        let new_col = new TableColumn(isStatic);

        columns.push(new_col);

        const data = this.state.data.map((const_row) => { return const_row.concat(null) });

        let ret = { columns: columns, data: data }


        this.state.document.update(
            { columns: this.serialize_headers(columns), data: this.serialize_data(data) }
        );
        this.setState(ret);
    }

    delete_col(ind) {
        if (!this.props.edit_mode) {
            return;
        }

        const columns = this.state.columns.slice();

        columns.splice(ind, 1);

        const data = this.state.data.slice();
        for (let i = 0; i < data.length; i++) {
            data[i].splice(ind, 1);
        }

        let ret = { columns: columns, data: data }

        this.state.document.update({
            columns: this.serialize_headers(columns), data: this.serialize_data(data)
        });

        this.setState(ret);

    }

    get_column_letters(num) {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let ret = [];

        while (num >= 1) {
            ret.push(letters[(num - 1) % letters.length])
            num = Math.floor((num - 1) / letters.length);
        }

        return ret.reverse().join("");
    }

    addRow(isStatic) {
        if (!this.props.edit_mode) {
            return;
        }

        const rows = this.state.rows.slice();
        let new_row = new TableRow(isStatic);

        rows.push(new_row);

        const data = this.state.data.slice();
        data.push(Array(this.state.columns.length).fill(null));

        let ret = { rows: rows, data: data };

        this.state.document.update({
            rows: this.serialize_headers(rows), data: this.serialize_data(data)
        });
        this.setState(ret);
    }


    delete_row(ind) {
        if (!this.props.edit_mode) {
            return;
        }

        const rows = this.state.rows.slice();

        rows.splice(ind, 1);

        const data = this.state.data.slice();
        data.splice(ind, 1);

        let ret = { rows: rows, data: data };

        this.state.document.update({
            rows: this.serialize_headers(rows), data: this.serialize_data(data)
        });
        this.setState(ret);

    }

    cell_is_static(x, y) {
        return this.state.rows[y].isStatic || this.state.columns[x].isStatic;
    }

    setCell(x, y, value) {
        let is_static = this.cell_is_static(x, y);

        if (this.props.edit_mode ^ is_static) {
            return;
        }

        const data = is_static ? this.state.data.slice() : this.state.dynamic_data.slice();

        if (value === "") {
            value = null;
        }

        data[y][x] = value;

        let ret = is_static ? { data: data } : { dynamic_data: data };

        if (is_static) {
            this.state.document.update({
                data: this.serialize_data(data)
            });
        } else {
            this.state.data_document.update({
                data: this.serialize_data(data)
            })
        }

        console.log("calling setstate")
        this.setState(ret);
    }

    setHeader(isRow, index, name) {
        if (name === "") {
            name = null;
        }

        let arr = (isRow ? this.state.rows : this.state.columns).slice();
        arr[index].name = name;

        let new_obj = isRow ? { rows: arr } : { columns: arr }
        this.setState(new_obj);
    }



    render() {


        if (this.state.valid === null) {
            return null;
        } else if (this.state.valid === false) {
            return <Redirect to={this.props.edit_mode ? ROUTES.TABLEADMIN : ROUTES.TABLE} />
        } else if (this.state.redirect === true) {
            return <Redirect to={`${this.props.edit_mode ? ROUTES.TABLEADMIN : ROUTES.TABLE}/${this.state.ndate}/${this.state.nblock}`} />
        }


        let table_data = this.process_spreadsheet();
        let raw_data = this.state.data;

        let column_headers = [];
        let table_cells = [];

        for (let i = 0; i < Math.max(this.state.rows.length, 1); i++) {

            let new_row = []
            if (this.state.rows.length >= 1) {
                new_row.push(
                    < TableHeaderComponent
                        key={`rowheader-${i}`}
                        name={this.state.rows[i].name}
                        default_name={i + 1}
                        isStatic={this.state.rows[i].isStatic}
                        setvalue={(name) => { this.setHeader(true, i, name) }}
                        delete={() => { this.delete_row(i) }}
                    />
                );
            }

            for (let u = 0; u < this.state.columns.length; u++) {
                if (i === 0) {
                    column_headers.push(
                        <TableHeaderComponent
                            key={`colheader-${u}`}
                            name={this.state.columns[u].name}
                            default_name={this.get_column_letters(u + 1)}
                            isStatic={this.state.columns[u].isStatic}
                            setvalue={(name) => { this.setHeader(false, u, name) }}
                            delete={() => { this.delete_col(u) }}
                        />
                    )
                }
                if (this.state.rows.length >= 1) {
                    new_row.push(
                        <TableCellComponent
                            key={`${i}-${u}`}
                            edit_mode={!(this.props.edit_mode ^ this.cell_is_static(u, i))}
                            value={table_data[i][u]}
                            raw_value={raw_data[i][u] != null ? raw_data[i][u] : ""}
                            isStatic={this.state.rows[i].isStatic || this.state.columns[u].isStatic}
                            setvalue={(value) => { this.setCell(u, i, value) }}
                        />
                    )
                }
            }

            if (this.state.rows.length) {
                table_cells.push(<tr key={`row-${i}`}>{new_row}</tr>);
            }



        }

        if (this.props.edit_mode) {
            column_headers.push(
                <td key="add_col">
                    <button className="btn" onClick={() => this.addCol(false)}>+</button>
                    <button className="btn btn-green" onClick={() => this.addCol(true)}>+</button>
                </td>
            );
            table_cells.push(
                <tr key="add_row">
                    <td>
                        <div className="btn-row">
                            <button className="btn" onClick={() => this.addRow(false)}>+</button>
                            <button className="btn btn-green" onClick={() => this.addRow(true)}>+</button>
                        </div>
                    </td>
                </tr>);
        }

        return (
            <div>
                { !this.props.edit_mode &&
                <table style = {{width: '100%'}}>
                    <tr>
                        <td style = {{textAlign: "center"}}>Table ID: {this.props.id}</td>
                        <td style = {{textAlign: "center"}}>Date: {this.props.date}  <br></br>
                        <input type = 'date' value = {this.state.ndate} onChange =  {this.onChange} onBlur = {(event) => {this.setState({ndate: event.target.value})}}></input></td>
                        <td style = {{textAlign: "center"}}>Block: {this.props.block} <br></br>
                        <input size = "4" type = 'number' min = '0' value = {this.state.nblock} onChange = {this.onChange} onBlur = {(event) => {this.setState({nblock: event.target.value})}}></input></td>
                        <td style = {{textAlign: "center"}}><button onClick = {() => {this.setState({redirect: true})}}>Search</button></td>
                    </tr>
                    </table>
                }
                <ul>
                    <li>Table Name: {this.state.table_name}</li>
                    <li>Table ID: {this.props.id}</li>
                    <li>Date: {this.props.date}</li>
                    <li>Block: {this.props.block}</li>
                </ul>
                <table>
                    <tbody>
                        <tr>
                            <th className="tbl-corner"></th>
                            {column_headers}
                        </tr>
                        {table_cells}
                    </tbody>
                </table>
            </div >
        );
    }
}

class TableColumn {
    constructor(isStatic) {
        this.name = null;
        this.isStatic = isStatic;
    }
    serialize() {
        return {
            name: null,
            isStatic: this.isStatic
        }
    }
    static from(json) {
        return Object.assign(new TableColumn(), json);
    }

}


class TableRow {
    constructor(isStatic) {
        this.name = null;
        this.isStatic = isStatic;
    }
    serialize() {
        return {
            name: this.name,
            isStatic: this.isStatic
        }
    }
    static from(json) {
        return Object.assign(new TableRow(), json);
    }


}


class TableHeaderComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            curr_value: props.name,
            editing: false,
        };

        this.input = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    toggle_edit() {
        console.log("edit toggled")

        this.setState({
            editing: !this.state.editing,
        });

    }

    _handleKeyDown(e) {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            this.state.curr_value = this.props.name;
            e.currentTarget.blur();
        }
    }

    render() {

        return (

            <th className={this.props.isStatic ? "static" : ""} >

                {
                    this.props.edit_mode &&
                    <button
                        className="close-button"
                        onClick={() => { this.props.delete() }}
                    >
                        X
                    </button>
                }
                { this.state.editing && <input
                    className="table-header"
                    autoFocus
                    value={this.state.curr_value}
                    onBlur={(e) => { this.props.setvalue(this.state.curr_value); this.toggle_edit() }}
                    onChange={(e) => { this.setState({ curr_value: e.target.value }) }}
                    onKeyDown={this._handleKeyDown}
                />}
                { !this.state.editing && <div className="table-header" onClick={() => { this.toggle_edit() }}>
                    {this.props.name || this.props.default_name}
                </div>}
            </th>
        );

    }
}

class TableCellComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            curr_value: props.raw_value,
            editing: false,
        };

        this.input = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    toggle_edit() {
        if (this.props.edit_mode) {
            console.log("edit toggled")

            this.setState({
                editing: !this.state.editing,
            });
        }

    }

    _handleKeyDown(e) {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            this.state.curr_value = this.props.raw_value;
            e.currentTarget.blur();
        }
    }

    render() {
        return (
            <td className={this.props.isStatic ? "static" : ""} >

                { this.state.editing && <input
                    autoFocus
                    value={this.state.curr_value}
                    onBlur={(e) => { this.props.setvalue(this.state.curr_value); this.toggle_edit() }}
                    onChange={(e) => { this.setState({ curr_value: e.target.value }) }}
                    onKeyDown={this._handleKeyDown}
                />}
                { !this.state.editing && <div className="tbl-div" onClick={() => { this.toggle_edit() }}>
                    {this.props.value}
                </div>}
            </td>
        );
    }
}

const TablePage = compose(
    withRouter,
    withFirebase,
)(TableUser);

// export default TableComponent;
export default TablePage;