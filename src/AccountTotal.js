import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import $ from 'jquery';

export default class AccountTotal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountNumber: "",
      equity: "",
      positiveEquity: false
    }

    this.getPortfolio = this.getPortfolio.bind(this);
    //this.getPositions = this.getPositions.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(this.props.token !== newProps.token) {
      var tokenString = "Token " + newProps.token;

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
        this.getPortfolio(newProps.token);
      }.bind(this));
    }
  }

  getPortfolio(token) {
    var url = 'https://api.robinhood.com/accounts/' + this.state.accountNumber + '/portfolio';
    var tokenString = "Token " + token;

    $.ajax({
        type: 'GET', 
        url: url,
        headers: {
          'Authorization': tokenString
        }
      })
      .then(function(data) {
        var equity = data.extended_hours_equity || data.equity;

        this.setState({
          equity: equity,
          positiveEquity: (equity > data.equity_previous_close)
        });
      }.bind(this));
  }

  // getPositions(accountNumber) {
  //   $.ajax({
  //       type: 'GET', 
  //       url: 'https://api.robinhood.com/accounts/',
  //       headers: {
  //         'Authorization': tokenString
  //       }
  //     })
  //     .then(function(data) {
  //       $.ajax({})
  //     }.bind(this));
  // }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div className = {this.state.positiveEquity ? "green-background": "red-background"} >
        <Header as='h1' className="accountTotal">{this.state.equity}</Header>
      </div>
    )
  }
}