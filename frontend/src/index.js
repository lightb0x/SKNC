import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';
// import Cookie from 'js-cookie';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import { backend } from './settings';

// axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.withCredentials = true;
// if (Cookie.get().csrftoken === undefined) {
//   axios.get(backend + '/protected');
// }
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
