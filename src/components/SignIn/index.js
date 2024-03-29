  
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';

import GoogleButton from 'react-google-button';

import './signin.css';

const SignInPage = () => (
    <div>
      <SignInForm/>
    </div>
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  onGoogleSignIn = () => {
    this.props.firebase.doGoogleSignIn()
    .then(()=> {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.LANDING);
    })
    .catch(error => {
      this.setState({ error });
    });
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
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
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
        <form className = 'container' onSubmit={this.onSubmit}>
          <h1>Ez-Ag Login</h1>
            <label for = 'email'><b>Email</b></label>
            <br></br>
            <input name="email" 
            value={email} 
            onChange={this.onChange} 
            type="text" 
            placeholder="Email Address"/>
            
            <br></br>
            <label for = 'password'><b>Password</b></label>
            <br></br>
            <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
           />
          <br></br>

          <button id = 'signin' disabled={isInvalid} type="submit">
            Sign In
          </button>

          <GoogleButton id = 'gbttn' onClick ={() => {this.onGoogleSignIn();}}></GoogleButton>
          <br></br>

          <PasswordForgetLink/>
          <SignUpLink />

          {error && <p style = {{color: 'red'}}>{error.message}</p>}
        </form>

    );
  }
}
 

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
 
export default SignInPage;
 
export { SignInForm };
