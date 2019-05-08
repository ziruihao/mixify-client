import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';

import Player from '../containers/player';
import Mixes from '../containers/mixes';
import Mixer from '../containers/mixer';
import TokenReceiver from '../containers/token-receiver';


const FallBack = () => {
  return <div>URL Not Found</div>;
};

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/auth/:token" component={TokenReceiver} />
          <Route exact path="/" component={Mixes} />
          <Route exact path="/player" component={Player} />
          <Route path="/:mixID" component={Mixer} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
