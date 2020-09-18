import React, { createContext, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Book from './components/Book/Book';
import Header from './components/Header/Header';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

export const UserContext = createContext()

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email:'',
    photo:'',
    success: '',
    error: '',

  })//initial value to see user details for google sign in and also be usable for other sign in methods
  return (
    <UserContext.Provider value = {[user, setUser]}>
      <Router>
        <h3>Name: {user.name}</h3>
          <Header/>
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/book/:bedType">
              <Book />
            </PrivateRoute>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
      </Router>
      </UserContext.Provider>
  );
}

export default App;
