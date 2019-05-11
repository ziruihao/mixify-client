import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

import queryString from 'query-string';

// actions
import { createMix, saveUser, currentizeMix } from '../actions';


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
          fromUser: {
            name: user.name,
            id: user.id,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }

    const query = queryString.parse(this.props.location.search);
    console.log(query);
    if (query.isCollaborator === 'true') {
      console.log('hello');
      this.props.saveUser(user);
      await this.props.currentizeMix(query.mixId, this.props.history);
      // this.props.history.push(`/mix/${query.mixId}`);
    } else {
      console.log('this shoudl be run');
      await this.props.createMix({
        name: 'Untitled mix',
        owner: user,
        collaborators: [user],
        tracks: [],
        spotifyPlaylistID: null,
      });
      this.props.saveUser(user);
      this.props.history.push(`/mix/${this.props.mix.id}`);
    }
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

export default withRouter(connect(mapStateToProps, { createMix, saveUser, currentizeMix })(TokenReceiver));
