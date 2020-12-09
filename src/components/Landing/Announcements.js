import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import './style/announcement.css';

class AnnouncementsList extends Component {
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

  
    render() {
        const { announcements, loading } = this.state;

        return (
            <div>
                <div div class = "e1">
                {announcements.map(announcement => (
                    <div>
                        <div class="card" id = {announcement.key}> 
                            <h3>{announcement.title}</h3>
                            <p>{announcement.text}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }
} 
  
const AnnouncementsPage = compose(
    withRouter,
    withFirebase,
)(AnnouncementsList);
  
export default AnnouncementsPage;