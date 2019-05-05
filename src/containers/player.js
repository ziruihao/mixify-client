import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Grommet
import { Button } from 'grommet';

// actions
import { getAudioFeatures } from '../actions';

// Spotify Web Player SDK
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.playerCheckInterval = null;
    this.player = null;
    this.state = {
      device_id: null,
      playerState: null,
      currentID: null,
    };
  }

  /**
   * This is here to keep checking if Spotify Web Player has completed setup yet.
   */
  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkIfPlayerExists(), 1000);
  }

  /**
   * A checker to see if Spotify Web Player has compeleted setup yet.
   */
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

  /**
   * All event handlers for Spotify Web Player.
   */
  playerEventHandlers = () => {
    this.player.on('initialization_error', (e) => { console.error(e); });
    this.player.on('authentication_error', (e) => {
      console.error(e);
      this.props.history.push('/');
    });
    this.player.on('account_error', (e) => { console.error(e); });
    this.player.on('playback_error', (e) => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onPlayerStateChange(state));

    // Ready
    this.player.on('ready', (data) => {
      const { device_id } = data;
      console.log(`Let the music play on ${this.state.device_id}!`);
      this.setState({ device_id });
    });
  }

  /**
   * Handles changes to the Spotify Web Player state.
   */
  onPlayerStateChange = (state) => {
    this.setState({ playerState: state }); console.log(state);
    this.setState({ currentID: state.track_window.current_track.id });
    this.props.getAudioFeatures(this.state.currentID);
  }

  /**
   * Rendering logic depending on whether there is cool audio insights for the current song.
   */
  renderIfHasAudioFeatures = () => {
    if (this.props.audioFeatures === null) {
      return null;
    } else {
      return (
        <div>
          <p>This song is in {this.musicKeyMapper(this.props.audioFeatures.key)} {this.props.audioFeatures.mode === 0 ? 'minor' : 'Major'}.</p>
          <p>Danciness: {this.props.audioFeatures.danceability}</p>
          <p>acousticness: {this.props.audioFeatures.acousticness}</p>
          <p>energy: {this.props.audioFeatures.energy}</p>
          <p>instrumentalness: {this.props.audioFeatures.instrumentalness}</p>
          <p>liveness: {this.props.audioFeatures.liveness}</p>
          <p>loudness: {this.props.audioFeatures.loudness}</p>
          <p>speechiness: {this.props.audioFeatures.speechiness}</p>
          <p>valence: {this.props.audioFeatures.valence}</p>
        </div>
      );
    }
  }

  /**
   * Helper function to map pitch class notation.
   */
  musicKeyMapper = (keyNum) => {
    let keyString = '?';
    switch (keyNum) {
      case 0:
        keyString = 'C';
        break;
      case 1:
        keyString = 'C#';
        break;
      case 2:
        keyString = 'D';
        break;
      case 3:
        keyString = 'D#';
        break;
      case 4:
        keyString = 'E';
        break;
      case 5:
        keyString = 'F';
        break;
      case 6:
        keyString = 'F#';
        break;
      case 7:
        keyString = 'G';
        break;
      case 8:
        keyString = 'G#';
        break;
      case 9:
        keyString = 'A';
        break;
      case 10:
        keyString = 'A#';
        break;
      case 11:
        keyString = 'B';
        break;
      default:
        break;
    }
    return keyString;
  }

  render() {
    if (this.state.playerState === null) {
      return (
        <div>Play a song!</div>
      );
    } else {
      return (
        <div>
          <p>Album: {this.state.playerState.track_window.current_track.album.name}</p>
          <p>Track: {this.state.playerState.track_window.current_track.name}</p>
          <p>Artists: {this.state.playerState.track_window.current_track.artists.map((artist) => { return artist.name; })}</p>
          <Button label="Previous" onClick={() => this.player.previousTrack()} />
          <Button label={this.state.playerState.paused ? 'Play' : 'Pause'} onClick={() => this.player.togglePlay()} />
          <Button label="Next" onClick={() => this.player.nextTrack()} />
          {this.renderIfHasAudioFeatures()}
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    token: state.auth.token,
    name: state.auth.name,
    audioFeatures: state.music.audioFeatures,
  }
);

export default withRouter(connect(mapStateToProps, { getAudioFeatures })(Player));
