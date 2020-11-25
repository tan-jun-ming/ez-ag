import React from 'react';
 
import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';

import './signout.css';
 
const SignOutButton = ({ firebase }) => (
  <AuthUserContext.Consumer>
  {authUser => (
    <button class = "button" onClick={firebase.doSignOut}>
    Sign Out, {authUser.displayName}
  </button>
  )}
  </AuthUserContext.Consumer>
);
 
export default withFirebase(SignOutButton);