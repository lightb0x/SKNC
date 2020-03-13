import React from 'react';
import { Provider } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import store from './store'

import Home from './container/Home';
import Boards from './container/Boards';
import Article from './container/Article';
import Signup from './container/Signup';
import Signin from './container/Signin';
import Admin from './container/Admin';
import ResetPass from './container/ResetPass';
import Draft from './container/Draft';
import NotFound from './container/NotFound';
import Write from './container/Write';

import NavBar from './component/NavBar';
import { boards, numArticlesOnHeader } from './settings';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <NavBar />
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
                  Object.keys(boards).map(function (item) {
                    return (
                      <Route
                        key={item}
                        path={"/" + item}
                        exact
                        component={Boards}
                      />
                    )
                  })
                }
                <Route
                  path="/:id(\d+)"
                  exact
                  component={Article}
                />
                <Route path="/signup" exact component={Signup} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/admin" exact component={Admin} />
                <Route path="/reset" exact component={ResetPass} />

                <Route path="/draft" exact component={Draft} />
                <Route path="/write" exact component={Write} />
                <Route component={NotFound} />
              </Switch>
            </BrowserRouter>
          </Col>
          <Col></Col>
        </Row></Container>
      </div>
    </Provider>
  );
};

export default App;
