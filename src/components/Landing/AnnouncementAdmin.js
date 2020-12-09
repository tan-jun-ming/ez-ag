import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Button } from '@material-ui/core';
import firebase from 'firebase';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import './style/announcement.css';
import { TimeToLeaveRounded } from '@material-ui/icons';

class AnnouncementsListA extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        loading: false,
        announcements: [],
        ...props.location.state,
      };
    }
  
    componentDidMount(){
      if(this.state.user)
        return;
      
        this.setState({ loading: true });


        this.props.firebase.fs.collection("announcements ").get()
            .then(snap => {
                let temp = [];
                snap.forEach(doc => {
                    temp.push({...doc.data(), key: doc.id });
                });

                this.setState({
                    announcements: temp,
                    loading: false,
                });
            });
    }

    onChange = event => {
        this.setState({[event.target.name]: event.target.value });
        console.log({[event.target.name]: event.target.value });
    }

    deleteAlert = (announcement) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h1>Delete {announcement.title}</h1>
                  <p>You want to delete this announcement?</p>

                  <Button onClick={onClose}
                  style = {{float: "right"}}> Cancel </Button>

                  <Button
                  style = {{float: "left"}}
                  color="secondary"
                  onClick={() => {this.deleteAnnouncement(announcement);onClose();}}> Yes, Delete it! </Button>
                </div>
              );
            }
          });
    }

    deleteAnnouncement = (announcement) => {
        console.log(announcement.key);
        const db = firebase.firestore();

        db.collection("announcements ").doc(announcement.key).delete();
        console.log('annoucement deleted');
    }

    editAlert = (announcement) => {
        const {title = announcement.title, message = announcement.text } = this.state;
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                    <h1>Edit {announcement.title}</h1>
                    <label for = 'title'><b>Title</b></label>
                    <br/>
                    <input name = 'title' classname = 'title'
                    defaultValue = {title}
                    type = 'text'
                    onChange = {this.onChange}/>

                    <br/>
                    <label for = 'text'><b>Message</b></label>
                    <br/>
                    <textarea name = 'text' className = "message"
                    defaultValue = {message}
                    type = 'text'
                    style = {{width: '100%', height: '200px'}}
                    onChange = {this.onChange}/>

                    <button onClick={onClose}
                    style = {{float: "right"}}> Cancel </button>

                    <button
                    style = {{float: "left"}}
                    onClick={() => {this.editAnnouncement(announcement.key, title, message, announcement);onClose();}}> Update </button>
                </div>
              );
            }
          });
    }

    editAnnouncement = (id, title, message, announcement) => {

        if(title === announcement.title && message === announcement.text){
            console.log('they are the same, no update is needed');
            console.log(id);
            console.log(title);
            console.log(message);
            return;
        }else{
            console.log(id);
            console.log(title);
            console.log(message);
        }
    }

  
    render() {
        const { announcements, loading } = this.state;

        return (
            <div>
                <div div class = "e1">
                {announcements.map(announcement => (
                    <div>
                        <div class="card" id = {announcement.key}> 
                            <div>
                                <strong>{announcement.title}</strong>
                                <Button className = 'deletebtn' 
                                variant="outlined" color="secondary"
                                style = {{float: "right"}}
                                onClick = {() => this.deleteAlert(announcement)}>Delete</Button>

                                {/* <Button className = 'editbtn'
                                variant="outlined" color="primary" 
                                style = {{float: "left"}}
                                onClick = {() => this.editAlert(announcement)}>Edit</Button> */}

                            </div>
                            <br/>
                            <p>{announcement.text}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }
} 
  
const AnnouncementsPageA = compose(
    withRouter,
    withFirebase,
)(AnnouncementsListA);
  
export default AnnouncementsPageA;