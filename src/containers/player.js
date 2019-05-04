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
      loggedIn: false,
    };
  }

  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkIfPlayerExists(), 1000);
  }

  checkIfPlayerExists = () => {
    const token = 'BQABA82sBAAwN48hLiiTP4cA42t_52ZVm0X-TigBiPHSZgv3hKp5FJPIYZR7SIl3kuODAee2s0BK81tbyvweVkZUcCFo9fPD9aeZr32QEeXcO2T5aLaQsXKpKmpwwu6XgHS8RVb_IFxOVM30eDfHEyGiAnFI-Tvw-CAV38FQYw';

    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: 'Matt\'s Mixify',
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
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', (e) => { console.error(e); });
    this.player.on('playback_error', (e) => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', (state) => { console.log(state); });

    // Ready
    this.player.on('ready', (data) => {
      const { device_id } = data;
      console.log('Let the music play on!');
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
    music: state.music,
  }
);

export default withRouter(connect(mapStateToProps, null)(Player));
