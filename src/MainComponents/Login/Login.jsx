import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import logo from '../../Common/images/download.png'
import '../../Common/css/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import userData from '../../Common/Data/UserData.json'
import Blogs from '../Blogs/Blogs.jsx'

import { Route, BrowserRouter as Router, Redirect, useHistory } from 'react-router-dom';
import { Switch } from 'react-router'

// Login Component to validate the user and redirect to blog page
const Login = () => {

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userIds, setuserIds] = useState(0);


  const history = useHistory();
  const userName = "";
  const userEmails = [];
  const userPass = [];

  userData.users.map(data => userEmails.push(data.email))
  userData.users.map(data => userPass.push(data.password))


  useEffect(() => {
    const value = localStorage.getItem("userName");
    if (value) {
      history.push("/blog");
    }
  }, [])
  function handleSubmit(event) {
    validateEntry();
    event.preventDefault();
  }

  //Used to update UserName & Password state
  const onChangeHandler = (event) => {
    if (event.target.name === "setUserEmail")
      setUserEmail(event.target.value)
    else if (event.target.name === "setPassword")
      setPassword(event.target.value)

  }

  //Used to validate userName & Password
  const validateEntry = () => {


    if (!userEmail || !password)
      alert("Please provide email & password")
    else {
      if (userEmails.includes(userEmail)) {

        const userindex = userEmails.indexOf(userEmail);
        setuserIds(userData.users[userindex].userID);

        if (userPass.includes(password) && password === userData.users[userindex].password) {

          localStorage.setItem('userID', userData.users[userindex].userID);
          localStorage.setItem('userName', userEmail);
          history.push("/blog");

        }
        else {
          alert("Password is invalid");
        }
      }
      else {
        alert("User Name doesn't exist");
      }


    }
  }




  const style = {

    backgroundColor: 'indigo'
  };

  return (
    <div className="Login" >
      <div style={style} >
        <img src={logo} className="logo" alt="logo" />
      </div>


      <Form className="login-box" onSubmit={handleSubmit}>
        <Form.Group size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control

            type="email"
            value={userEmail}
            name="setUserEmail"
            onChange={onChangeHandler}



          />
        </Form.Group>
        <Form.Group size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="setPassword"
            onChange={onChangeHandler}

          />
        </Form.Group>
        <Button block size="lg" type="submit">
          Login
        </Button>
      </Form>
      {console.log(userIds + "   " + userEmail)}




    </div>
  )
}

export default Login;