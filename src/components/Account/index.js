import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import  firebase  from 'firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import './account.css';

class Account extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            email: '',
            fullName: '',
            ...props.location.state,
        };
    }

    componentDidMount(){
        if(this.state.user)
            return;

        this.setState({loading: true});

        this.unsubscribe = this.props.firebase.fs
            .collection("users").doc(firebase.auth().currentUser.uid)
            .onSnapshot(snapshot => {
                this.setState({
                    email: snapshot.data().email,
                    fullName: snapshot.data().fullName,
                });
            });
    }

    render(){

        return(
            <div>
                <div id='header'>
                    <h1>Account: {this.state.email} </h1>
                    <h1>Name: {this.state.fullName} </h1>
                </div>
                <div id='container'>
                    <div id='first'><PasswordForgetForm /></div>
                    <div id='second'><PasswordChangeForm /></div>
                    <div id='clear'></div>
                </div>
            </div>
        )
    }
}

const AccountPage = compose(
    withRouter, withFirebase,
)(Account);

export default AccountPage;

// const AccountPage = () => (
//     <AuthUserContext.Consumer>
//         {authUser => (
//             <div>
//                 <div id='header'>
//                     <h1>Account: {authUser.email}</h1>
//                     <h1>Name: {authUser.displayName}</h1>
//                 </div>
//                 <div id='container'>
//                     <div id='first'><PasswordForgetForm /></div>
//                     <div id='second'><PasswordChangeForm /></div>
//                     <div id='clear'></div>
//                 </div>
//             </div>
//             // <div id = "header">
//             //   <h1>Account: {authUser.email}</h1>
//             //   <h1>Name: {authUser.displayName}</h1>
//             //   <div id = 'container'>
//             //     <div id = 'first'><PasswordForgetForm/></div>
//             //     <div id = 'second'><PasswordChangeForm/></div>
//             //     <div id = 'clear'></div>
//             //   </div>
//             // </div>
//         )}
//     </AuthUserContext.Consumer>
// );

// const condition = authUser => !!authUser;

// export default withAuthorization(condition)(AccountPage);