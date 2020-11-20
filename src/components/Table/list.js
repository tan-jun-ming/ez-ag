import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class TableListComponent extends Component {

    render() {
        // Get user's tables here
        
        let ret = [
            <li><Link to={ROUTES.TABLE + "/table1"}>Table 1</Link></li>,
            <li><Link to={ROUTES.TABLE + "/table2"}>Table 2</Link></li>,
            <li><Link to={ROUTES.TABLE + "/R62xOP9QQLJur8DJraeu"}>Table 3</Link></li>
        ]
        return (
            <ul>
                {ret}
            </ul>
        );
    }
}

export default TableListComponent;