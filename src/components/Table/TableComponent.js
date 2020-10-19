import React, { Component } from 'react';
import EditableLabel from 'react-editable-label';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            rows: [],
            data: [],
        }
    }

    addCol(isStatic) {
        const columns = this.state.columns.slice();
        columns.push(new TableColumn(isStatic));
        const consts = this.state.consts.map((const_row) => { return const_row.concat(null) });
        this.setState({ columns: columns, consts: consts });

    }

    addRow(isStatic) {
        const rows = this.state.rows.slice();
        rows.push(new TableRow(isStatic));
        const consts = this.state.consts.slice();
        consts.push(Array(this.state.columns.length).fill(null));
        this.setState({ rows: rows, consts: consts });
    }

    render() {
        let table_data = this.state.data; // TODO: use external method to calculate with formulas

        let column_headers = [];
        let table_cells = [];
        for (let i = 0; i < this.state.rows.length; i++) {
            let new_row = [
                <TableHeaderComponent name={this.state.rows[i].name} index={i} />
            ]

            for (let u = 0; u < this.state.columns.length; u++) {
                if (i === 0) {
                    column_headers.push(
                        <TableHeaderComponent
                            name={this.state.columns[u].name}
                            isStatic={this.state.columns[u].isStatic}
                            index={u}
                        />
                    )
                }
                new_row.push(
                    <TableCellComponent
                        value={table_data[i][u]}
                        isStatic={this.state.rows[i].isStatic || this.state.columns[u].isStatic}
                        pos_x={u}
                        pos_u={i}
                    />
                )
            }

            table_cells.push(<tr>{new_row}</tr>);

        }


        return (
            <div>
                <button onClick={() => this.addRow(true)}>Add Static Row</button>
                <button onClick={() => this.addCol(true)}>Add Static Column</button>
                <button onClick={() => this.addRow(false)}>Add Dynamic Row</button>
                <button onClick={() => this.addCol(false)}>Add Dynamic Column</button>

                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            {column_headers}
                        </tr>
                        {table_cells}
                    </tbody>
                </table>
            </div>
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
                save={value => {
                    console.log(`Saving '${value}'`);
                }}
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
                save={value => {
                    console.log(`Saving '${value}'`);
                }}

            />
        </td>
    )
}

export default TableComponent;