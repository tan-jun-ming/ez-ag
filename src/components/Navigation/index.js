import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import './nav.css';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul className="navbar">
        <li className="navbar-item"><Link to={ROUTES.LANDING}> Ez-Ag </Link></li>
        <li className="navbar-item"><Link to={ROUTES.HOME}>Home</Link></li>
        <li className="navbar-item"><Link to={ROUTES.ACCOUNT}>Account</Link> </li>
        <li className="navbar-item"><Link to={ROUTES.TABLE}>Table</Link></li>
        <li className="navbar-item"><Link to={ROUTES.ADMIN}>Admin</Link></li>
        <li className="navbar-item" style={{ float: 'right' }}><SignOutButton /></li>
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