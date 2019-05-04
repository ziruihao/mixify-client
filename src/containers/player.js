import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Spotify Web Player SDK
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.playerCheckInterval = null;
    this.state = {
      device_id: {},
    };
  }

  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkIfPlayerExists(), 1000);
  }

  checkIfPlayerExists = () => {
    const { token } = this.props;

    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: `${this.props.name}'s Mixify`,
        getOAuthToken: (cb) => { cb(token); },
      });
      this.playerEventHandlers();

      // finally, connect!
      this.player.connect();
    }
  }

  playerEventHandlers = () => {
    this.player.on('initialization_error', (e) => { console.error(e); });
    this.player.on('authentication_error', (e) => {
      console.error(e);
      this.props.history.push('/');
    });
    this.player.on('account_error', (e) => { console.error(e); });
    this.player.on('playback_error', (e) => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', (state) => { console.log(state); });

    // Ready
    this.player.on('ready', (data) => {
      const { device_id } = data;
      console.log(`Let the music play on ${this.state.device_id}!`);
      this.setState({ device_id });
    });
  }

  render() {
    return (
      <div />
    );
  }
}

const mapStateToProps = state => (
  {
    token: state.auth.token,
    name: state.auth.name,
  }
);

export default withRouter(connect(mapStateToProps, null)(Player));
