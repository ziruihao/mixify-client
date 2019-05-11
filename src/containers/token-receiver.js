import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// actions
import { createMix, saveUser } from '../actions';

const SPOTIFY_URL = 'https://api.spotify.com/v1';

class TokenReceiver extends React.Component {
  async componentWillMount() {
    await this.grabUserData();
  }

  grabUserData = async () => {
    const user = {
      name: '',
      id: '',
      token: this.props.match.params.token,
      topTracks: [],
    };

    // sets up authentication configurations for call to Spotify
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };

    // retrieves user's account data
    try {
      const response = await axios.get(`${SPOTIFY_URL}/me`, config);
      user.name = response.data.display_name;
      user.id = response.data.id;
    } catch (error) {
      console.log(error);
    }

    // retrieves user's musical preferences
    try {
      const response = await axios.get(`${SPOTIFY_URL}/me/top/tracks?limit=15`, config);
      response.data.items.forEach((track) => {
        user.topTracks.push({
          name: track.name,
          id: track.id,
          uri: track.uri,
          popularity: track.popularity,
          albumName: track.album.name,
          artistNames: track.artists.map(artist => artist.name),
          fromUser: user.name,
        });
      });
    } catch (error) {
      console.log(error);
    }
    await this.props.createMix({
      name: 'Untitled mix',
      collaborators: [user],
      tracks: [],
    });
    this.props.saveUser(user);
    this.props.history.push(`/mix/${this.props.mix.id}`);
  }

  render() {
    return (<div>beep boop</div>);
  }
}

const mapStateToProps = state => (
  {
    mix: state.mixes.current,
  }
);

export default withRouter(connect(mapStateToProps, { createMix, saveUser })(TokenReceiver));
