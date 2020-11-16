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
        authUser ? <NavigationAuth /> : <NavigationNonAuth/>
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
    <ul>
    <li><Link to={ROUTES.LANDING}> Ez-Ag </Link></li>
    <li><Link to={ROUTES.HOME}>Home</Link></li>
    <li><Link to={ROUTES.ACCOUNT}>Account</Link> </li>
    <li><Link to={ROUTES.ADMIN}>Admin</Link></li>
    <li style = {{float:'right'}}><SignOutButton/></li>
    </ul>

);

const NavigationNonAuth = () => (
  <ul>
    <li><Link to={ROUTES.LANDING}> Ez-Ag </Link></li>
    <li style = {{float:'right'}}><Link to={ROUTES.SIGN_IN}> Sign In</Link></li>
    <li style = {{float:'right'}}><Link to={ROUTES.SIGN_UP}> Sign Up </Link></li>
  </ul>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
        <li>
            <Link to={ROUTES.TABLE}>Table</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul>
);

export default Navigation;