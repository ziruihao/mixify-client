import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

// actions imports
import { updateMix, currentizeMix } from '../actions';

import Player from './player';


class Mixer extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    this.state = {
      newToken: '',
      collaborators: [],
      mixUpdate: {
        name: '',
        collaboratorTokens: [],
        tracks: [],
      },
    };
  }

  componentDidMount() {
    this.props.currentizeMix(this.props.match.params.mixID, this.props.history);
    this.refreshCollaboratorData();
  }

  // sleep time expects milliseconds
  sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }


  refreshCollaboratorData = () => {
    return new Promise((resolve, reject) => {
      const collaborators = [];
      for (let i = 0; i < this.props.mix.collaboratorTokens.length; i += 1) {
        this.sleep(1000).then(() => {
          const collaborator = {
            name: '',
            id: '',
            token: this.props.mix.collaboratorTokens[i],
            topTracks: [],
          };

          // sets the config with authorization of current collaborator's token
          const config = {
            headers: { Authorization: `Bearer ${collaborator.token}` },
          };

          // retrieves collaborator data
          axios.get(`${this.SPOTIFY_URL}/me`, config).then((response) => {
            console.log('USER DATA:');
            console.log(response.data);
            collaborator.name = response.data.display_name;
            collaborator.id = response.data.id;
          }).catch((error) => {
            console.log(error);
          });

          // retrieves collaborator musical preferences
          axios.get(`${this.SPOTIFY_URL}/me/top/tracks?limit=10`, config).then((response) => {
            console.log('USER TRACKS:');
            console.log(response.data);
            const tempTrack = {
              name: '',
              id: '',
              uri: '',
              popularity: null,
              albumName: '',
              artists: [],
            };
            response.data.items.forEach((track) => {
              tempTrack.name = track.name;
              tempTrack.id = track.id;
              tempTrack.uri = track.uri;
              tempTrack.popularity = track.popularity;
              tempTrack.albumName = track.album.name;
              tempTrack.artists = track.artists.map(artist => artist.name);
              collaborator.topTracks.push(Object.assign({}, tempTrack));
            });
          }).catch((error) => {
            console.log(error);
          });
          // adds collaborator to list
          collaborators.push(collaborator);
        });
      }
      this.setState({
        collaborators,
      });
      resolve();
    });
  }


  /**
   * Retrieves user's data from Spotify API and adds the user to the database of this mix.
   */
  addCollaborator = () => {
    // adds this collaborator's token to list of collaborators
    this.setState((prevState) => {
      prevState.mixUpdate.collaboratorTokens.push(prevState.newToken);
      return (prevState);
    });
    // updates the database
    this.props.updateMix(this.state.mixUpdate, this.props.match.params.mixID);
    this.refreshCollaboratorData();
  }

  /**
   * Mixes the playlist!
   */
  mixx = () => {
    this.refreshCollaboratorData();
    this.sleep(3000).then(() => {
      console.log('begining');
      let playlistID = '';
      const config = {
        headers: {
          Authorization: `Bearer ${this.props.mixOwner.token}`,
          'Content-Type': 'application/json',
        },
      };
      let body = {
        name: 'Mixx',
        description: 'For the aux king.',
      };
      axios.post(`${this.SPOTIFY_URL}/users/${this.props.mixOwner.id}/playlists`, body, config).then((response) => {
        playlistID = response.data.id;

        let mixTracks = [];

        this.state.collaborators.forEach((collaborator) => {
          mixTracks = collaborator.topTracks.concat(mixTracks);
        });
        console.log(`MIX TRACKS: ${mixTracks}`);
        const mixTracksURIs = mixTracks.map(track => track.uri);
        body = {
          uris: mixTracksURIs,
        };
        console.log(body);
        axios.post(`${this.SPOTIFY_URL}/playlists/${playlistID}/tracks`, body, config).then((response2) => {
          console.log(response2);
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }


  render() {
    if (this.props.mix === null) {
      return (<div>404: post not found</div>);
    } else {
      console.log(this.props.mix);
      const users = this.props.mix.collaboratorTokens.map(token => <p key={token}>{token}</p>);
      return (
        <div id="mix">
          <div>
            <input placeholder="Add mix collaborator via token:" value={this.state.newToken} onChange={event => this.setState({ newToken: event.target.value })} />
            <button type="button" onClick={this.addCollaborator}>Add User</button>
          </div>
          <div>
            <p>Users:</p>
            {users}
          </div>
          <div>
            <button type="button" onClick={this.mixx}>Mix</button>
          </div>
          <Player />
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    mixOwner: state.auth,
    mix: state.mixes.current,
  }
);

export default withRouter(connect(mapStateToProps, { updateMix, currentizeMix })(Mixer));
