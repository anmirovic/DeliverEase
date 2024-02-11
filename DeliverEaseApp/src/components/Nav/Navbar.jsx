import React, { useEffect, useState } from 'react';
import './../../styles/Navbar.css';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'

const Navbar = (props) => {
  useEffect(()=>{
    props.getUser();
  },[]);
  
  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to={"/"} className="btn btn-primary ms-3">DeliverEase</Link>
        {props.user === undefined || props.user === null?
          (
          <div className="navbar-login">
            <Link to={"/login"} className="btn btn-primary">Login </Link>
            <Link to={"/register"} className="btn btn-primary">Register</Link>
          </div>
          ):
          (
          <div>
            <Link to={"/account"} className="btn btn-primary me-3">{props.user.username}</Link>
          </div>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;