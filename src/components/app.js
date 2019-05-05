import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';

import Player from '../containers/player';
import Login from '../containers/login';
import Mixes from '../containers/mixes';
import Mixer from '../containers/mixer';


const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

const App = (props) => {
  if (props.token === null) {
    return (
      <Login />
    );
  } else {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Mixes} />
            <Route exact path="/mixes" component={Mixes} />
            <Route path="/mixes/:mixID" component={Mixer} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
};

const mapStateToProps = state => (
  {
    token: state.auth.token,
  }
);

export default connect(mapStateToProps)(App);
