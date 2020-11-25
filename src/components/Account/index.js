import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import './account.css';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
      <div id = 'header'>
        <h1>Account: {authUser.email}</h1>
        <h1>Name: {authUser.displayName}</h1>
      </div>
        <div id = 'container'>
          <div id = 'first'><PasswordForgetForm/></div>
          <div id = 'second'><PasswordChangeForm/></div>
          <div id = 'clear'></div>
        </div>
      </div>
  // <div id = "header">
  //   <h1>Account: {authUser.email}</h1>
  //   <h1>Name: {authUser.displayName}</h1>
  //   <div id = 'container'>
  //     <div id = 'first'><PasswordForgetForm/></div>
  //     <div id = 'second'><PasswordChangeForm/></div>
  //     <div id = 'clear'></div>
  //   </div>
  // </div>
  )}
  </AuthUserContext.Consumer>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(AccountPage);