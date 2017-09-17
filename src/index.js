import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

console.log(process.env.REACT_APP_TEST);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
