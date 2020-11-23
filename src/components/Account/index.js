import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';


const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
  <div>
    <h1>Account: {authUser.email}</h1>
    <h1>uid: {authUser.uid}</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
  )}
  </AuthUserContext.Consumer>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(AccountPage);