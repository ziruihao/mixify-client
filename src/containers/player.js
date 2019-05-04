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
    const token = 'BQDD_N75Hu-wBXcv5xUkm9MqVQl124L_3T2QZbdkoqu8iC2dWo4mwdSGt0mFfAqhKriKXeJkv5HWM3ag3UVdKFu0vNrKDUik_dhC2wMfBu_hTeW_2MhsAF8V-KezmnCvf8vn-tR6lVdTh4aAkge0mETxu-6tj-2ud5IEtNPa2w';

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
