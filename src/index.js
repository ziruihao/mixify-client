// React imports
import React from 'react';
import ReactDOM from 'react-dom';

// Redux imports
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

// style imports
import './style.scss';

// import App
import App from './components/app';

// creates the store
const store = createStore(reducers, {}, compose(
  applyMiddleware(),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main'),
);
