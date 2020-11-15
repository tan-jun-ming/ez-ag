import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import './signup.css';

const SignUpPage = () => (
  <div>
    <div class = 'container'>
      <SignUpForm />
    </div>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    event.preventDefault();

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne, username)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
 
    
 
  }
 

 onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div class = 'container' id = 'signupform'>
        <h1>Ez-Ag Sign In</h1>
        <label for = 'name'><b>Enter Full Name</b></label>
         <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <label for = 'email'><b>Enter Email</b></label>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <label for = 'password'><b>Enter Password</b></label>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <label for = 'repassword'><b>Confirm Password</b></label>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button id = 'signup' disabled={isInvalid} type="submit">
          Sign Up
        </button>
        </div>
 
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
 
export default SignUpPage;

export { SignUpForm, SignUpLink };