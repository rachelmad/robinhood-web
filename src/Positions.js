import React, { Component } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import $ from 'jquery';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer, VictoryAxis } from 'victory';

export default class Positions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positions: []
    }

    this.getPositions = this.getPositions.bind(this);
    this.transformPositionData = this.transformPositionData.bind(this);
    this.getStockData = this.getStockData.bind(this);
    this.getQuoteData = this.getQuoteData.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.token && this.props.accountNumber) {
      this.getPositions(this.props.token, this.props.accountNumber);
    }
  }

  getPositions(token, accountNumber) {
    var url = 'https://api.robinhood.com/accounts/' + accountNumber + '/positions';
    var tokenString = "Token " + token;

    $.ajax({
        type: 'GET', 
        url: url,
        headers: {
          'Authorization': tokenString
        }
      })
      .then(function(data) {
        this.transformPositionData(data.results);
      }.bind(this));
  }

  transformPositionData(data) {
    var positions = [];
    var forBinding = this;

    data.forEach(function(position) {
      if(position.quantity != 0) {
        positions.push({
          url: position.instrument,
          buyPrice: Number(position.average_buy_price).toFixed(2),
          units: Number(position.quantity).toFixed(0)
        });
      }
    })

    forBinding.getStockData(positions);
  }

  getStockData(positions) {
    var self = this;

    Promise.all(positions.map(function(position) {
      return Promise.resolve(
        $.ajax({
          type: 'GET', 
          url: position.url
        })
      )
    }))
    .then(function(results) {
      for (var i = 0; i < positions.length; i++) {
        positions[i].symbol = results[i].symbol;
      };

      self.getQuoteData(positions);
    });
  }

  getQuoteData(positions) {
    var symbols = [];
    var self = this;

    positions.forEach(function(position) {
      symbols.push(position.symbol);
    })
    var url = 'https://api.robinhood.com/quotes/?symbols=' + symbols.join();

    $.ajax({
      type: 'GET',
      url: url
    }).then(function(data) {
      for (var i = 0; i < positions.length; i++) {
        positions[i].price = Number(data.results[i].last_trade_price).toFixed(2);
      };

      self.setState({
        positions: positions
      });
    })
  }

  render() {
    var rows = [];

    this.state.positions.forEach(function(position) {
      rows.push(
        <Table.Row>
          <Table.Cell>{position.symbol}</Table.Cell>
          <Table.Cell>{position.buyPrice}</Table.Cell>
          <Table.Cell>{position.units}</Table.Cell>
          <Table.Cell>{position.price}</Table.Cell>
        </Table.Row>
      )
    });

    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Stock</Table.HeaderCell>
              <Table.HeaderCell>Buy Price</Table.HeaderCell>
              <Table.HeaderCell>Units</Table.HeaderCell>
              <Table.HeaderCell>Current Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    )
  }
}