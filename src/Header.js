import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import $ from 'jquery';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }
  }

  componentWillReceiveProps(newProps) {
    if(this.props.token !== newProps.token) {
      var tokenString = "Token " + newProps.token;

      $.ajax({
        type: 'GET', 
        url: 'https://api.robinhood.com/user/',
        headers: {
          'Authorization': tokenString
        }
      })
      .then(function(data) {
        this.setState(prevState => ({
            name: data.first_name
          })
        );
      }.bind(this));
    }
    
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item header>Robinhood</Menu.Item>
        <Menu.Item name='dashboard' active={activeItem === 'dashboard'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item header>Hi {this.state.name}</Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}