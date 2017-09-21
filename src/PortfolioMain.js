import React, { Component } from 'react';
import { Card, Statistic } from 'semantic-ui-react';
import $ from 'jquery';

export default class PortfolioMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountNumber: "",
      equity: 0,
      equity_change: 0,
      equity_change_percent: 0,
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
        var equity = Number(data.extended_hours_equity || data.equity);
        var equity_change = equity - data.equity_previous_close;

        this.setState({
          equity: equity,
          positiveEquity: (equity > data.equity_previous_close),
          equity_change: equity_change,
          equity_change_percent: ((equity_change/equity) * 100)
        });
      }.bind(this));
  }

  render() {
    var equity = "$" + this.state.equity.toFixed(2);
    var sign = (this.state.positiveEquity ? "+" : "-");
    var equity_change = sign + "$" + this.state.equity_change.toFixed(2) + " (" + sign + this.state.equity_change_percent.toFixed(2) + "%)";

    return (
      <div>
        <Card fluid>
          <Card.Content id="portfolio-main-header" className = {this.state.positiveEquity ? "green-background": "red-background"} >
            <Card.Header>
              <Statistic id="portfolio-main-header-text" value={equity} label={equity_change} />
            </Card.Header>
          </Card.Content>
        </Card>
      </div>
    )
  }
}