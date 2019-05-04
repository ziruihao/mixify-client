import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Grommet
import { Button } from 'grommet';

// actions
import { requestLogin, saveToken } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  requestLogin = () => {
    // this.props.requestLogin();
    this.props.saveToken(this.state.token);
    this.props.history.push('/app');
  }

  render() {
    return (
      <div>
        <div className="App-header">
          <h2>Now Playing</h2>
        </div>
        <p className="App-intro">
        Enter your Spotify access token. Get it from{' '}
          <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
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

export default withRouter(connect(mapStateToProps, { requestLogin, saveToken })(Login));
