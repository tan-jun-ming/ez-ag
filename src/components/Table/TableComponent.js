import React, { Component } from 'react';
import EditableLabel from 'react-editable-label';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            rows: [],
            consts: [],
        }
    }

    addCol() {
        const columns = this.state.columns.slice();
        columns.push(new TableColumn());
        const consts = this.state.consts.map((const_row) => { return const_row.concat(null) });
        this.setState({ columns: columns, consts: consts });

    }

    addRow() {
        const rows = this.state.rows.slice();
        rows.push(new TableRow());
        const consts = this.state.consts.slice();
        consts.push(Array(this.state.columns.length).fill(null));
        this.setState({ rows: rows, consts: consts });
    }

    render() {
        let table_data = this.state.consts; // TODO: use external method to calculate with formulas

        let table_cells = [];
        for (let i = 0; i < this.state.rows.length; i++) {
            let new_row = [<TableHeaderComponent name={this.state.rows[i].name} />]
            new_row.push(table_data[i].map((dt) => { return <TableCellComponent value={dt} /> }))

            table_cells.push(<tr>{new_row}</tr>);

        }


        let column_headers = this.state.columns.map((col) => { return <TableHeaderComponent name={col.name} /> })

        return (
            <div>
                <button onClick={() => this.addRow()}>Add Row</button>
                <button onClick={() => this.addCol()}>Add Column</button>

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
    name = "Column";
    isStatic = false;
}


class TableRow {
    name = "Row";
    isStatic = false;
    formula = null;
}

class TableHeaderComponent extends Component {
    render() {
        return (
            <th>
                <EditableLabel
                    initialValue={this.props.name}
                    inputClass="table-header"
                    labelClass="table-label"
                    save={value => {
                        console.log(`Saving '${value}'`);
                    }}
                />
            </th>
        );
    }
}

class TableCellComponent extends Component {
    render() {
        return (
            <td>
                <EditableLabel
                    initialValue={this.props.value}
                    labelClass="table-label"
                    save={value => {
                        console.log(`Saving '${value}'`);
                    }}

                />
            </td>
        )
    }
}
export default TableComponent;