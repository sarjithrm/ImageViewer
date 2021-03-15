import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './screens/login/Login';
import Home from './screens/home/Home';
import Profile from './screens/profile/Profile';

class Controller extends Component{
    constructor(){
        super();
        this.baseUrl = "https://graph.instagram.com/";
    }

    render(){
        return(
            <Router>
                <div className="main-container">
                    <Route exact path='/' render={(props) => <Login {...props}/>} />
                    <Route path='/home' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>} />
                    <Route path='/profile' render={(props) => <Profile {...props} baseUrl={this.baseUrl}/>} />
                </div>
            </Router>
        )
    }
}

export default Controller;