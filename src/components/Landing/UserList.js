import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import  firebase  from 'firebase';

import user_logo from './img/user_logo.png';

import './style/user.css';

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
                      temp.push({...doc.data(), uid: doc.id });
                  });
  
                  this.setState({
                      users: temp,
                      loading: false,
                  });

                  console.log('User data is grabbed');
              });
      }

      render() {
        const { users, loading } = this.state;

        return (
            <div>
                <br/>
                <div div class = "e1">
                {users.map(user => (
                    <div className = "chip">
                        <img src = {user_logo} alt = {user.fullName} width = "96" height = "96"/>
                        {user.fullName}
                        <input type = 'checkbox' className = 'switch' id = {user.uid}/>
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