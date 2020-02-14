import React from 'react';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Home from './container/Home';
import Boards from './container/Boards';
import NotFound from './container/NotFound';

import NavBar from './component/NavBar';
import boardNames from './boardSetting';


import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar boardNames={boardNames} />
        <Switch>
          <Redirect exact from="/" to="/home" />

          <Route path="/home" exact component={Home} />
          {
            boardNames.forEach(function (item) {
              return <Route path={item} exact component={Boards} />
            })
          }
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
