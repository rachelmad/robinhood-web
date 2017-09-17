import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import Header from './Header.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {

  }
   render() {
    return (
      <div className="App">
        <Header></Header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button>
          Sample
        </Button>
      </div>
    );
  }
}

export default App;
