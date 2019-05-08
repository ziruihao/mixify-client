import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Player from '../containers/player';
import Mixer from '../containers/mixer';
import TokenReceiver from '../containers/token-receiver';
import Login from './login';


const FallBack = () => {
  return <div>URL Not Found</div>;
};

const App = (props) => {
  if (props.mixOwner.token === null) {
    return (
      <Router>
        <Route path="/auth/:token" component={TokenReceiver} />
        <Route component={Login} />
      </Router>
    );
  } else {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/auth/:token" component={TokenReceiver} />
            <Route exact path="/" component={Player} />
            <Route exact path="/player" component={Player} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
};

const mapStateToProps = state => (
  {
    mixOwner: state.auth,
  }
);

export default (connect(mapStateToProps, null)(App));
