import React from 'react';
import { connect } from 'react-redux';

// Grommet
import { Button } from 'grommet';

import axios from 'axios';

// actions
import { requestLogin, saveUser } from '../actions';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    this.state = {
      token: '',
    };
  }

  /**
   * Sends request to process a login to mixify-server.
   */
  requestLogin = () => {
    // this.props.requestLogin();
    const user = {
      name: '',
      id: '',
      token: this.state.token,
    };
    const config = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    axios.get(`${this.SPOTIFY_URL}/me`, config).then((response) => {
      console.log(response.data);
      user.name = response.data.display_name;
      user.id = response.data.id;
    }).catch((error) => {
      console.log(error);
    });
    this.props.saveUser(user);
  }

  render() {
    return (
      <div>
        <div className="App-header">
          <h2>Now Playing</h2>
        </div>
        <p className="App-intro">
          Enter your Spotify access token. Get it from{' '}
          <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify" target="_blank" rel="noopener noreferrer">
          here
          </a>.
        </p>
        <p>
          <input type="text" value={this.state.token} onChange={event => this.setState({ token: event.target.value })} />
        </p>
        <p>
          <Button label="Go" onClick={this.requestLogin} />
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    token: state.auth.token,
  }
);

export default (connect(mapStateToProps, { requestLogin, saveUser })(Login));
