import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';

// import Player from '../containers/player';
import Mixer from '../containers/mixer';
import TokenReceiver from '../containers/token-receiver';
import Splash from './splash';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/auth/:token" component={TokenReceiver} />
          <Route exact path="/mix/:id" component={Mixer} />
          {/* <Route exact path="/player" component={Player} /> */}
          <Route component={Splash} />
        </Switch>
      </div>
    </Router>
  );
};

const mapStateToProps = state => (
  {
    mixOwner: state.auth,
  }
);

export default (connect(mapStateToProps, null)(App));
