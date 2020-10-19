import React, { Component } from 'react';
import EditableLabel from 'react-editable-label';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            rows: [],
            data: [], // columns, rows
        }
    }

    addCol(isStatic) {
        const columns = this.state.columns.slice();
        columns.push(new TableColumn(isStatic));
        const data = this.state.data.map((const_row) => { return const_row.concat(null) });
        this.setState({ columns: columns, data: data });

    }

    addRow(isStatic) {
        const rows = this.state.rows.slice();
        rows.push(new TableRow(isStatic));
        const data = this.state.data.slice();
        data.push(Array(this.state.columns.length).fill(null));
        this.setState({ rows: rows, data: data });
    }

    setCell(x, y, value) {
        if (value === "") {
            value = null;
        }

        const data = this.state.data.slice();
        data[y][x] = value;
        this.setState({ data: data });
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
        let table_data = this.state.data; // TODO: use external method to calculate with formulas

        let column_headers = [];
        let table_cells = [];

        for (let i = 0; i < Math.max(this.state.rows.length, 1); i++) {

            let new_row = []
            if (this.state.rows.length >= 1) {
                new_row.push(
                    < TableHeaderComponent
                        name={this.state.rows[i].name}
                        isStatic={this.state.rows[i].isStatic}
                        setvalue={(name) => { this.setHeader(true, i, name) }}
                    />
                );
            }

            for (let u = 0; u < this.state.columns.length; u++) {
                if (i === 0) {
                    column_headers.push(
                        <TableHeaderComponent
                            name={this.state.columns[u].name}
                            isStatic={this.state.columns[u].isStatic}
                            setvalue={(name) => { this.setHeader(false, u, name) }}
                        />
                    )
                }
                if (this.state.rows.length >= 1) {
                    new_row.push(
                        <TableCellComponent
                            value={table_data[i][u]}
                            isStatic={this.state.rows[i].isStatic || this.state.columns[u].isStatic}
                            setvalue={(value) => { this.setCell(u, i, value) }}
                        />
                    )
                }
            }

            if (this.state.rows.length) {
                table_cells.push(<tr>{new_row}</tr>);
            }

        }


        return (
            <div>
                <table class="btn-tbl">
                    <tr>
                        <td>
                            <button class="btn" onClick={() => this.addRow(true)}>Add Static Row</button>
                        </td>
                        <td>
                            <button class="btn" onClick={() => this.addRow(false)}>Add Dynamic Row</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button class="btn" onClick={() => this.addCol(false)}>Add Dynamic Column</button>
                        </td>
                        <td>
                            <button class="btn" onClick={() => this.addCol(true)}>Add Static Column</button>
                        </td>
                    </tr>
                </table>

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
        this.name = "New Column";
        this.isStatic = isStatic;
    }
}


class TableRow {
    constructor(isStatic) {
        this.name = "New Row";
        this.isStatic = isStatic;
    }
}

function TableHeaderComponent(props) {
    return (
        <th className={props.isStatic ? "static" : ""}>
            <EditableLabel
                initialValue={props.name}
                inputClass="table-header"
                labelClass="table-label"
                save={(value) => { props.setvalue(value) }}
            />
        </th>
    );
}

function TableCellComponent(props) {
    return (
        <td className={props.isStatic ? "static" : ""}>
            <EditableLabel
                initialValue={props.value}
                labelClass="table-label"
                save={(value) => { props.setvalue(value) }}

            />
        </td>
    )
}

export default TableComponent;