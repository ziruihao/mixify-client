import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

// actions
import { saveUser } from '../actions';

const SPOTIFY_URL = 'https://api.spotify.com/v1';

const TokenReceiver = (props) => {
  const user = {
    name: '',
    id: '',
    token: props.match.params.token,
  };
  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  axios.get(`${SPOTIFY_URL}/me`, config).then((response) => {
    console.log(response.data);
    user.name = response.data.display_name;
    user.id = response.data.id;
  }).catch((error) => {
    console.log(error);
  });
  props.saveUser(user);
  props.history.push('/');
  return (<div>beep boop</div>);
};

export default withRouter(connect(null, { saveUser })(TokenReceiver));
