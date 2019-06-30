import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomeComponent from "./components/home";
import LoginComponent from "./components/login";
import LogoutComponent from "./components/logout";
import {BrowserRouter as Router, Route} from "react-router-dom";
import NavbarComponent from "./components/navbar";

ReactDOM.render(
    <Router>
        <div>
            <NavbarComponent/>

            <Route path="/" exact component={HomeComponent}/>
            <Route path="/home" component={HomeComponent}/>
            <Route path="/login/" component={LoginComponent}/>
            <Route path="/logout/" component={LogoutComponent}/>
        </div>
    </Router>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
