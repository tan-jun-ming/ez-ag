import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebase from "firebase";

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
      this.db = app.database();
      this.fs = app.firestore();
      this.provider = new app.auth.GoogleAuthProvider();
    }
  
    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password, username) =>{
      let global = this;
      return new Promise(function(resolve, reject) {
        
        global.auth.createUserWithEmailAndPassword(email, password)
        .then(({user}) => {
          const userUid = user.uid;

          global.createUserDocument(userUid, email, username);
          resolve(user);
          
        })
        .catch(error => {
          reject(error);
        });
    

      });
      
    }
      
  
    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);
  
    doSignOut = () => this.auth.signOut();
  
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    doGoogleSignIn = () => {
      return this.auth.signInWithPopup(this.provider)
      .then(async({user}) => {
        //console.log(user);
        //let global = this;
        const displayName = user.displayName;
        const email = user.email;
        const uid = user.uid;
        //console.log(user.uid)
        
        const userref = this.fs.collection('users').doc(uid);
        const doc = await userref.get();
            
        if (!doc.exists) {
          this.createUserDocument(uid, email, displayName);
        }
      });
    }
  
    // *** User API ***
  
    user = uid => this.db.ref(`users/${uid}`);
  
    users = () => this.db.ref('users');


    // *** Database API ***

    createUserDocument = (userID, email, fullname) => {
      const account = {
        fullName: fullname,
        email: email,
        isAdmin: false,
        spreadSheetIDs: []
      }
      this.fs.collection('users').doc(userID).set(account);
    }
      

  }
  
  export default Firebase;