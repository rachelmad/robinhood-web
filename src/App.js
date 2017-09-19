import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import $ from 'jquery';

import Header from './Header.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      token: ""
    };
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    var bodyString = "username=" + process.env.REACT_APP_USERNAME + "&password=" + process.env.REACT_APP_PASSWORD;

    $.ajax({
      type: 'POST', 
      url: 'https://api.robinhood.com/api-token-auth/',
      data: bodyString
    })
    .then(function(data) {
      this.setState(prevState => ({
          token: data.token
        })
      );
    }.bind(this));
  }

  logOut() {
    var tokenString = "Token " + this.state.token;

    $.ajax({
      type: 'POST', 
      url: 'https://api.robinhood.com/api-token-logout/',
      headers: {
        'Authorization': tokenString
      },
      success: function(data) {
        console.log(data);
      }
    });
  }

   render() {
    return (
      <div className="App">
        <Header token={this.state.token}></Header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button onClick={this.logOut}>
          Log Out
        </Button>
      </div>
    );
  }
}

export default App;
