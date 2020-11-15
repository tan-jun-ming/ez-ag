import React from 'react';
 
import { withFirebase } from '../Firebase';

import './signout.css';
 
const SignOutButton = ({ firebase }) => (
  <button class = "button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);
 
export default withFirebase(SignOutButton);