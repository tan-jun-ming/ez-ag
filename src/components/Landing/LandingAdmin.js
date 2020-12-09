import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import  firebase  from 'firebase';

import './style/landing.css';
import AnnouncementsPageA from './AnnouncementAdmin';
import UserPage from './UserList';

import Collapsible from 'react-collapsible';
import Modal from 'react-bootstrap';

class LandingAdmin extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      user: null,
      isAdmin: false,
      title: '',
      text: '',
      error: null,
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

  onSubmit = event => {
    const { title, text } = this.state;

    const data = {
        title: title,
        text: text,
        userid: firebase.auth().currentUser.uid,
    }

    console.log(data);

    const db = firebase.firestore();

    db.collection("announcements ").add({
      title: title,
      text: text,
      userid: firebase.auth().currentUser.uid
    });

    this.setState({
      title: ' ',
      text: ' '
    });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {

    const { title, text } = this.state;

    const isInvalid = title === '' || text === '';

    return (
      <div>
        <Collapsible trigger = "Create a new announcement">
          <div class = 'card'>
            <form onSubmit = {this.onSubmit}>
              <label for = 'title'><b>Title</b></label>
              <br/>
              <input name = 'title'
              value = {title}
              type = 'text'
              onChange = {this.onChange}
              placeholder = 'Title'/>

              <br/>
              <label for = 'text'><b>Message</b></label>
              <br/>
              <textarea name = 'text'
              value = {text}
              type = 'text'
              onChange = {this.onChange}
              style = {{width: '100%', height: '200px'}}
              placeholder = 'Message'/>

              <br/>
              <button id = 'abttn' disabled = {isInvalid} type = 'submit'>Create</button>
          </form>
        </div>
        </Collapsible>
        <ul className = "navbar2">
          <h1>
          Announcements
          {/* <button style={{ float: 'right' }}>Edit Announcement</button>
          <button style={{ float: 'right' }}>Delete Announcement</button> */}
          </h1>
        </ul>
        <AnnouncementsPageA/>

        <br/>

        <Collapsible trigger = "Manage Users">
          <UserPage/>
        </Collapsible>
      </div>
    );
  }
}

const LandingPageAdmin = compose(
    withRouter,
    withFirebase,
)(LandingAdmin);

export default LandingPageAdmin;