import React, { Component } from 'react';
import { Card, Statistic } from 'semantic-ui-react';
import $ from 'jquery';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer, VictoryAxis } from 'victory';

export default class PortfolioMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountNumber: "",
      equity: 0,
      equity_change: 0,
      equity_change_percent: 0,
      positiveEquity: false,
      historicals: []
    }

    this.getPortfolio = this.getPortfolio.bind(this);
    this.getPortfolioHistorical = this.getPortfolioHistorical.bind(this);
    this.transformPortfolioData = this.transformPortfolioData.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.token && newProps.accountNumber) {
      this.getPortfolio(newProps.token, newProps.accountNumber);
      this.getPortfolioHistorical(newProps.token, newProps.accountNumber);
    }
  }

  getPortfolio(token, accountNumber) {
    var url = 'https://api.robinhood.com/accounts/' + accountNumber + '/portfolio';
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

  getPortfolioHistorical(token, accountNumber) {
    var span = "all";
    var url = 'https://api.robinhood.com/portfolios/historicals/' + accountNumber + '?span=' + span;
    var tokenString = "Token " + token;

    $.ajax({
        type: 'GET', 
        url: url,
        headers: {
          'Authorization': tokenString
        }
      })
      .then(function(data) {
        this.transformPortfolioData(data.equity_historicals);
      }.bind(this));
  }

  transformPortfolioData(data) {
    var historicals = []
    data.forEach(function(value) {
      historicals.push({
        x: new Date(value.begins_at),
        y: Number(value.adjusted_close_equity)
      })

      // if(!value.adjusted_close_equity || !value.begins_at) {
        // console.log(value.begins_at, value.adjusted_close_equity)
      // }
    });
    // for (var i = 0; i < 2; i++) {
    //   historicals.push({
    //     x: new Date(data[i].begins_at),
    //     y: Number(data[i].adjusted_close_equity)
    //   });
    // };

    this.setState({
      historicals: historicals
    })
  }

  render() {
    var equity = "$" + this.state.equity.toFixed(2);
    var sign = (this.state.positiveEquity ? "+" : "-");
    var equity_change = sign + "$" + this.state.equity_change.toFixed(2) + " (" + sign + this.state.equity_change_percent.toFixed(2) + "%)";
    var lineColor = (this.state.positiveEquity ? "#00d19d" : "#f83f40");

    return (
      <div>
        <Card fluid>
          <Card.Content id="portfolio-main-header" className = {this.state.positiveEquity ? "green-background": "red-background"} >
            <Card.Header>
              <Statistic id="portfolio-main-header-text" value={equity} label={equity_change} />
            </Card.Header>
          </Card.Content>
          <Card.Content>
              <VictoryChart 
                containerComponent={
                  <VictoryVoronoiContainer 
                    labels={(d) => `${d.x}, ${d.y}`} 
                    labelComponent={<VictoryTooltip/>} />
                }
                padding={0}>
                <VictoryLine 
                  data={this.state.historicals} 
                  style={{
                    data: {
                      stroke: lineColor
                    },
                    labels: {
                      fontSize: 8
                    }
                  }}
                  x="x"
                  y="y" />
                <VictoryAxis crossAxis 
                  style={{
                    axis: {
                      stroke: "none"
                    },
                    tickLabels: {
                      fontSize: 0
                    }
                  }} />
              </VictoryChart>
          </Card.Content>
        </Card>
      </div>
    )
  }
}