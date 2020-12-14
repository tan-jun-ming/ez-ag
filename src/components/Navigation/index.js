import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import Notifications from '@material-ui/icons/Notifications';
import './nav.css';
import logo from './ez-ag-logo-white.png';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth/> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul className="navbar">
        {/* <li><Link to={ROUTES.HOME}><img src = {logo} width="20" height="20" /></Link></li> */}
        <li className="navbar-item"><Link to={ROUTES.LANDING}>Ez-Ag</Link></li>
        <li className="navbar-item"><Link to={ROUTES.ACCOUNT}>Account</Link> </li>
        <li className="navbar-item"><Link to={ROUTES.TABLE}>Table</Link></li>
        <li className="navbar-item"><Link to={ROUTES.TABLEADMIN}>Admin</Link></li>
        <li style={{ float: 'right' }}><SignOutButton /></li>
        <li className="navbar-item" style={{ float: 'right' }}><Link to={ROUTES.TABLEVIEW}><Notifications fontSize="small" /></Link></li>
    </ul>

);

const NavigationNonAuth = () => (
    <ul className="navbar">
        <li className="navbar-item"><Link to={ROUTES.LANDING}> Ez-Ag </Link></li>
        <li className="navbar-item" style={{ float: 'right' }}><Link to={ROUTES.SIGN_IN}> Sign In</Link></li>
        <li className="navbar-item" style={{ float: 'right' }}><Link to={ROUTES.SIGN_UP}> Sign Up </Link></li>
    </ul>
);

export default Navigation;