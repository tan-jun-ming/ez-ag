import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import  firebase  from 'firebase';

import './style/announcement.css';

class UserList extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          loading: false,
          users: [],
          ...props.location.state,
        };
      }
    
      componentDidMount(){
        if(this.state.user)
          return;
        
          this.setState({ loading: true });
  
  
          this.props.firebase.fs.collection("users").get()
              .then(snap => {
                  let temp = [];
                  snap.forEach(doc => {
                      temp.push({...doc.data(), key: doc.id });
                      console.log(temp);
                      console.log(doc.data());
                      console.log(doc.id);
                  });
  
                  this.setState({
                      users: temp,
                      loading: false,
                  });
              });
      }

      render() {
        const { users, loading } = this.state;

        return (
            <div>
                <div div class = "e1">
                {users.map(user => (
                    <div>
                        <div class="card"> 
                            <h3>{user.fullName}</h3>
                            <p> {user.email}</p>
                            <p>User is an admin: </p>{user.isAdmin ? <div>true</div> : <div>false</div>}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }
}

const UserPage = compose(
    withRouter,
    withFirebase,
)(UserList);

export default UserPage;