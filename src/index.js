// React imports
import React from 'react';
import ReactDOM from 'react-dom';

// style imports
import './style.scss';
import { Grommet } from 'grommet';

// Redux imports
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

// import App
import App from './components/app';

// creates the store
const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

// Gormmet UI theme customization
const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

ReactDOM.render(
  <Provider store={store}>
    <Grommet theme={theme}>
      <App />
    </Grommet>
  </Provider>,
  document.getElementById('main'),
);
