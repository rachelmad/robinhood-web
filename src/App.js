import React, { Component } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import $ from 'jquery';

import Header from './Header.js';
import PortfolioMain from './PortfolioMain.js';
import Positions from './Positions.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      token: "",
      accountNumber: ""
    };

    this.logOut = this.logOut.bind(this);
    this.getAccountNumber = this.getAccountNumber.bind(this);
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

      this.getAccountNumber(data.token);
    }.bind(this))
  }

  getAccountNumber(token) {
    var tokenString = "Token " + token;

      $.ajax({
        type: 'GET', 
        url: 'https://api.robinhood.com/accounts/',
        headers: {
          'Authorization': tokenString
        }
      })
      .then(function(data) {
        this.setState({
          accountNumber: data.results[0].account_number
        })
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
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={6}>
              <PortfolioMain token={this.state.token} accountNumber={this.state.accountNumber}></PortfolioMain>
            </Grid.Column>
            <Grid.Column width={10}>
              <Positions token={this.state.token} accountNumber={this.state.accountNumber}></Positions>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Button onClick={this.logOut}>
          Log Out
        </Button>
      </div>
    );
  }
}

export default App;
