import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';

import Player from '../containers/player';
import Login from '../containers/login';

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/app" component={Player} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
