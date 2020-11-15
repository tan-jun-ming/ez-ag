import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import './passwordforgot.css';
import Modal from "react-bootstrap/Modal";
 
const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);
 
const INITIAL_STATE = {
  email: '',
  error: null,
};
 
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email } = this.state;
 
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, error } = this.state;
 
    const isInvalid = email === '';
 
    return (
      <form onSubmit={this.onSubmit}>
        <div class = 'container' id = 'forgotform'>
          <h1>Reset Password</h1>
          <label for = 'email'><b>Email</b></label>
          <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
          />
        
        <button id ='forogtbttn' disabled={isInvalid} type="submit">
          Reset My Password
        </button>
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);
 
export default PasswordForgetPage;
 
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
 
export { PasswordForgetForm, PasswordForgetLink };