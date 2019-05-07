import React from 'react';
import { connect } from 'react-redux';

// Grommet
import {
  Button, Heading, Text, TextInput, Box,
} from 'grommet';

// Axios
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
      <Box alignSelf="center" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large" width="500px" height="300px" id="login">
        <Heading color="brand">Mixify</Heading>
        <Text>
            Enter your Spotify access token. Get it from{' '}
          <a href="https://mixify-server.herokuapp.com/login" target="_blank" rel="noopener noreferrer">
              here
          </a>.
        </Text>
        <Text>
          <TextInput value={this.state.token} placeholder="your token please" onChange={event => this.setState({ token: event.target.value })} />
        </Text>
        <Button primary color="brand" hoverIndicator="true" label="Go" onClick={this.requestLogin} />
      </Box>
    );
  }
}

const mapStateToProps = state => (
  {
    token: state.auth.token,
  }
);

export default (connect(mapStateToProps, { requestLogin, saveUser })(Login));
