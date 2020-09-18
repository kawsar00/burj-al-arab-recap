import React, { useContext, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';


if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const Login = () => {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useContext(UserContext)
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

//**********************GOOGLE SIGN IN & SIGN OUT************************ */
//code for google sign and their information
    var provider = new firebase.auth.GoogleAuthProvider();
    const handleGoogleLogIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                const { displayName, email, photoURL } = result.user;
                const signInUser = {
                    isSignIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                }
                setUser(signInUser)
                history.replace(from);
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }
//code for google sign out user
    const handleGoogleLogOut = () => {
        firebase.auth().signOut()
        .then(res => {
            const signOutUser = {
                isSignIn: false,
                name: '',
                email: '',
                photo: '',
            }
            setUser(signOutUser)
          })
          .catch(error => {
            console.log(error)
          });
    }
//********************END GOOGLE SIGN IN & SIGN OUT********************** */

//update user name 
const UpdateUserInfo = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
    displayName: name
    })
    .then(function() {
        console.log('user update successfully')
    })
    .catch(function(error) {
        console.log(error)
    });
}

//****************USER EMAIL, PASSWORD SIGN IN & SIGN OUT**************** */

//____________code for sign in and sign up user_________________________
    const handleSubmit = (e) => {
        console.log(user.email, user.password)

        if (newUser && user.email && user.password) {
         //sign up user code
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user }
                    newUserInfo.error = ''
                    newUserInfo.success = true
                    setUser(newUserInfo)
                    UpdateUserInfo(user.name)
                })
                .catch(function (error) {
                    const newUserInfo = { ...user }
                    newUserInfo.error = error.message
                    newUserInfo.success = false
                    setUser(newUserInfo)
                });
        }
         //sign in user code
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = { ...user }
                newUserInfo.error = ''
                newUserInfo.success = true
                setUser(newUserInfo)
                console.log('sign in user info', res.user)
            })
            .catch(function(error) {
                const newUserInfo = { ...user }
                newUserInfo.error = error.message
                newUserInfo.success = false
                setUser(newUserInfo)
              });
        }
        
        e.preventDefault()
    }

//_______________________handle blur function_________________________
const handleBlur = (e) => {
    // console.log(e.target.value, e.target.name)

    let isFieldValid = true
    if(e.target.name === 'email') {
        isFieldValid = /\S+@\S+\.\S+/.test(e.target.value) 
    }
    if(e.target.name === 'password') {
        const isPasswordValid = e.target.value.length > 6 //must be more than 6 digit
        const PasswordHasNumber = /\d{1}/.test(e.target.value) // should have minimum 1 number
        isFieldValid = isPasswordValid && PasswordHasNumber
        console.log(isPasswordValid, PasswordHasNumber)
    }
    if (isFieldValid) {
        const newUserInfo = {...user}
        newUserInfo[e.target.name] = e.target.value
        setUser(newUserInfo)
    }
}
//**************END USER EMAIL, PASSWORD SIGN IN & SIGN OUT************** */



    return (
        <div className="App">
            {
                user.isSignIn ? <button onClick={handleGoogleLogOut}>Log Out</button> : <button onClick={handleGoogleLogIn}>Google Log In</button>
            }
            {
                user.isSignIn && <div>
                    <h2>Welcome to {user.name}</h2>
                    <img src={user.photo} alt=""/>
                </div>
            }
            <br />
            <br />
{/* **********************************************************************/}
            <form onSubmit={handleSubmit} >
                <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)}/> {/* toogle name input */}
                
                <label htmlFor="newUser">User Sign In</label> <br/>
                
                {newUser && <input onBlur={handleBlur} type="text" name="name" placeholder="Your Name" required />} <br />

                <input onBlur={handleBlur} type="email" name="email" placeholder="Your Email" required /><br />
                <input onBlur={handleBlur} type="password" name="password" placeholder="Your Password" /><br />
                <input type="submit" value="Submit" />
            </form>
{/* **********************************************************************/}
        <p style={{color:"red"}}>{user.error}</p>
        {user.success && <p style={{color:"green"}}>User {newUser ? 'Created' : 'LoggedIn'}  Successfully</p>}
        </div>
    );
};

export default Login;