import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Header extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item header>Robinhood</Menu.Item>
        <Menu.Item name='dashboard' active={activeItem === 'dashboard'} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item header>Hi Name</Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}