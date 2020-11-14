import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

  var config = {
    apiKey: "AIzaSyBk8RIjdas1ryALJoRCOh9KKEgAvWOMuUE",
    authDomain: "ez-ag-e880f.firebaseapp.com",
    databaseURL: "https://ez-ag-e880f.firebaseio.com",
    projectId: "ez-ag-e880f",
    storageBucket: "ez-ag-e880f.appspot.com",
    messagingSenderId: "900809352312",
    appId: "1:900809352312:web:822e4b06e17291dd2eb98d",
    measurementId: "G-B5K37HFC9T"
  };

  


  class Firebase {
    constructor() {
      app.initializeApp(config);
  
      this.auth = app.auth();
      this.db = app.firestore();
      this.provider = new app.auth.GoogleAuthProvider();
    }
  
    // *** Auth API ***
  
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);
  
    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);
  
    doSignOut = () => this.auth.signOut();
  
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    doGoogleSignIn = () => {
      return this.auth.signInWithPopup(this.provider);
    }
  
    // *** User API ***
  
    user = uid => this.db.ref(`users/${uid}`);
  
    users = () => this.db.ref('users');
  }
  
  export default Firebase;