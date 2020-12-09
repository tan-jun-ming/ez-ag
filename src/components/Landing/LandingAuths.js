import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import  firebase  from 'firebase';
import LandingPageAdmin from './LandingAdmin';
import AnnouncementsPage from './Announcements';

import './style/landing.css';

class LandingAuths extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      user: null,
      isAdmin: false,
      ...props.location.state,
    };
  }

  componentDidMount(){
    if(this.state.user)
      return;
    
      this.setState({ loading: true });

      this.unsubscribe = this.props.firebase.fs
      .collection("users").doc(firebase.auth().currentUser.uid)
      .onSnapshot(snapshot => {
        this.setState({
          user: snapshot.data(),
          loading: false,
          isAdmin: snapshot.data().isAdmin,
        });
        console.log(this.state.user);
      });
  }

  render() {
    return (
      <div>
        {this.state.isAdmin ? <LandingPageAdmin/> : <LandingUser/>}
      </div>
    );
  }
}


const LandingUser = () => (
  <div>
    <h1>Announcements</h1>
    <AnnouncementsPage/>
  </div>
)

const LandingPageAuth = compose(
  withRouter,
  withFirebase,
)(LandingAuths);

export default LandingPageAuth;
