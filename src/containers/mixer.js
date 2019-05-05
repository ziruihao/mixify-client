import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import classnames from 'classnames';

// actions imports
import { updateMix, currentizeMix } from '../actions';


class Mixer extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    this.state = {
      newToken: '',
      mixUpdate: {
        name: '',
        users: [],
        tracks: [],
      },
    };
  }

  componentDidMount() {
    this.props.currentizeMix(this.props.match.params.mixID, this.props.history);
  }

  /**
   * Retrieves user's data from Spotify API and adds the user to the database of this mix.
   */
  addUser = () => {
    const newUser = {
      name: '',
      id: '',
      token: this.state.newToken,
      topTracks: [],
      // genres: [],
    };
    const config = {
      headers: { Authorization: `Bearer ${this.state.newToken}` },
    };

    axios.get(`${this.SPOTIFY_URL}/me`, config).then((response) => {
      console.log(response.data);
      newUser.name = response.data.display_name;
      newUser.id = response.data.id;
    }).catch((error) => {
      console.log(error);
    });

    axios.get(`${this.SPOTIFY_URL}/me/top/tracks`, config).then((response) => {
      console.log(response.data);
      const tempTrack = {
        name: '',
        id: '',
        popularity: null,
        albumName: '',
        artists: [],
      };
      response.data.items.forEach((track) => {
        tempTrack.name = track.name;
        tempTrack.id = track.id;
        tempTrack.popularity = track.popularity;
        tempTrack.albumName = track.album.name;
        tempTrack.artists = track.artists.map(artist => artist.name);
        newUser.topTracks.push(Object.assign({}, tempTrack));
      });
    }).catch((error) => {
      console.log(error);
    });
    console.log(this.state.mixUpdate);
    this.setState((prevState) => {
      prevState.mixUpdate.users.push(newUser);
      return ({ mixUpdate: prevState.mixUpdate });
    });
    this.props.updateMix(this.state.mixUpdate, this.props.match.params.mixID);
  }


  render() {
    if (this.props.mix === null) {
      return (<div>404: post not found</div>);
    } else {
      const users = this.props.mix.users.map(user => <p key={user.id}>{user.name}</p>);
      return (
        <div id="mix">
          <div>
            <input placeholder="Add mix collaborator via token:" value={this.state.newToken} onChange={event => this.setState({ newToken: event.target.value })} />
            <button type="button" onClick={this.addUser}>Add User</button>
          </div>
          <div>
            <p>Users:</p>
            {users}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    mix: state.mixes.current,
  }
);

export default withRouter(connect(mapStateToProps, { updateMix, currentizeMix })(Mixer));
