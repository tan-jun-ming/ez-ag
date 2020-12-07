import React from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';

import './signout.css';

const SignOutButton = ({ firebase }) => (
    <AuthUserContext.Consumer>
        {authUser => (
            <button className="button" onClick={firebase.doSignOut}>
                Sign Out
            </button>
        )}
    </AuthUserContext.Consumer>
);

export default withFirebase(SignOutButton);