/* eslint-disable no-await-in-loop */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

// Grommet
import {
  Button, Heading, Text, TextInput, Box, Grid,
} from 'grommet';

// actions imports
import { updateMix, currentizeMix } from '../actions';

import Player from './player';

class Mixer extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    this.state = {
      firstRefresh: false,
      newToken: '',
      collaborators: [],
      mixUpdate: {
        name: this.props.mix.name,
        collaboratorTokens: [this.props.mixOwner.token],
        tracks: this.props.mix.tracks,
      },
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.refreshCollaboratorData = this.refreshCollaboratorData.bind(this);
    this.refreshCollaboratorDataHelper = this.refreshCollaboratorDataHelper.bind(this);
    this.mixx = this.mixx.bind(this);
  }

  componentWillMount() {
    this.props.currentizeMix(this.props.match.params.mixID, this.props.history);
  }

  componentDidUpdate() {
    if (!(this.props.mix === null) && !this.state.firstRefresh) {
      this.refreshCollaboratorData();
      console.log('component refreshing');
      this.state.firstRefresh = true;
    }
  }

  sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  /**
   * Retrieves user's data from Spotify API and adds the user to the database of this mix.
   */
  async addCollaborator() {
    // adds this collaborator's token to list of collaborators
    this.setState((prevState) => {
      prevState.mixUpdate.collaboratorTokens.push(prevState.newToken);
      return (prevState);
    });
    console.log(this.state.mixUpdate);
    // updates the database
    this.props.updateMix(this.state.mixUpdate, this.props.match.params.mixID);
    await this.refreshCollaboratorData();
  }

  /**
   * Refreshes all the collaborators' data by retrieiving the most up-to-date music preferences from Spotifty API.
   */
  async refreshCollaboratorData() {
    // creates new collaborators template
    const collaborators = [];
    console.log(this.props.mix);
    for (let i = 0; i < this.props.mix.collaboratorTokens.length; i += 1) {
      const collaborator = await this.refreshCollaboratorDataHelper(i);
      // adds collaborator to list
      collaborators.push(collaborator);
    }
    this.setState({
      collaborators,
    });
    console.log('fresh complete');
  }

  /**
   * Heplper function to atomize the asynchornize process of freshing collaborator data.
   * @param {Number} i
   */
  async refreshCollaboratorDataHelper(i) {
    // creates a new collaborator template
    const collaborator = {
      name: '',
      id: '',
      token: this.props.mix.collaboratorTokens[i],
      topTracks: [],
    };
    // sleep is necessary to not get rejected by Spotify API for too many requests too fast
    await this.sleep(10).then(() => {
      // sets the config with authorization of current collaborator's token
      const config = {
        headers: { Authorization: `Bearer ${collaborator.token}` },
      };

      // retrieves collaborator account data
      axios.get(`${this.SPOTIFY_URL}/me`, config).then((response) => {
        collaborator.name = response.data.display_name;
        collaborator.id = response.data.id;
      }).catch((error) => {
        console.log(error);
      });

      // retrieves collaborator musical preferences
      axios.get(`${this.SPOTIFY_URL}/me/top/tracks?limit=10`, config).then((response) => {
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
    });
    console.log('a single helper is done');
    return collaborator;
  }

  /**
   * Mixes the playlist!
   */
  async mixx() {
    await this.refreshCollaboratorData();
    let playlistID = '';
    console.log('begining to mix');
    // sets up axios headers with the necessary tokens
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.mixOwner.token}`,
        'Content-Type': 'application/json',
      },
    };

    // sets up the axios request bodt with the name and description of the playlist to be made
    let body = {
      name: 'Mixify',
      description: 'For the aux king.',
    };
    axios.post(`${this.SPOTIFY_URL}/users/${this.props.mixOwner.id}/playlists`, body, config).then((response) => {
      playlistID = response.data.id;

      // begins generating the local playlist
      let mixTracks = [];

      this.state.collaborators.forEach((collaborator) => {
        console.log(collaborator);
        console.log(collaborator.topTracks);
        mixTracks = mixTracks.concat(collaborator.topTracks);
        console.log(mixTracks);
      });
      const mixTracksURIs = mixTracks.map(track => track.uri);

      // sets up the axios request body with the local playlist to be sent into Spotify API
      body = {
        uris: mixTracksURIs,
      };

      // posts the new local playlist to the Spotify API
      axios.post(`${this.SPOTIFY_URL}/playlists/${playlistID}/tracks`, body, config).then(() => {
        // yay!
        console.log('Mix successful!');
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    if (this.props.mix === null) {
      return (<div>404: post not found</div>);
    } else if (!this.state.firstRefresh) {
      return (<div>loading</div>);
    } else {
      return (
        <Box id="mix" pad="medium">
          <Grid
            fill
            rows={['400px', '100px']}
            columns={['300px', '600px']}
            gap="small"
            areas={[
              { name: 'collaborators', start: [0, 0], end: [0, 0] },
              { name: 'mixer', start: [1, 0], end: [1, 0] },
              { name: 'player', start: [0, 1], end: [1, 1] },
            ]}
          >
            <Box gridArea="collaborators" border={{ size: 'medium', color: 'brand' }} pad="large" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              <Heading color="brand" level="3">Collaborators</Heading>
              <TextInput placeholder="token please" value={this.state.newToken} onChange={event => this.setState({ newToken: event.target.value })} />
              <Button primary color="brand" hoverIndicator="true" onClick={this.addCollaborator} label="Add" />
              <p>Users:</p>
              <Box align="start" justify="around">
                hi {}
              </Box>
            </Box>
            <Box gridArea="mixer" border={{ size: 'medium', color: 'brand' }} pad="large" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              <Button primary color="brand" onClick={this.mixx} label="Mix" />
            </Box>
            <Box gridArea="player" border={{ size: 'medium', color: 'brand' }} pad="large" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              <Player />
            </Box>
          </Grid>
        </Box>
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
