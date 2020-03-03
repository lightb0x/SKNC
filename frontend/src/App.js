import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Home from './container/Home';
import Boards from './container/Boards';
import Admin from './container/Admin';
import NotFound from './container/NotFound';
import Draft from './container/Draft';

import NavBar from './component/NavBar';
import { boards, numArticlesOnHeader } from './settings';

import './App.css';

function App() {
  const boardNames = Object.keys(boards);

  const boardPath = (boardName) => {
    const slash = "/";
    return slash.concat(boardName);
  };

  return (
    <div className="App">
      <NavBar boardNames={boardNames} />
      <Container><Row>
        <Col></Col>
        <Col xs={12} sm={10} md={10} lg={8} xl={6}>
          <BrowserRouter>
            <Switch>
              <Redirect exact from="/" to="/home" />

              <Route exact path="/home" render={() =>
                <Home numArticles={numArticlesOnHeader} />
              } />

              {
                boardNames.map(function (item) {
                  return (
                    <Route
                      key={item}
                      path={boardPath(item)}
                      exact
                      component={Boards}
                    />
                  )
                })
              }
              <Route path="/admin" exact component={Admin} />

              {/* TODO : requires authentication ! */}
              <Route path="/draft" exact component={Draft} />
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
        </Col>
        <Col></Col>
      </Row></Container>
    </div>
  );
};

export default App;
