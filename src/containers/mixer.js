/* eslint-disable prefer-const */
/* eslint-disable for-direction */
/* eslint-disable no-await-in-loop */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

// Grommet
import {
  Button, Heading, Text, TextInput, Box, Grid,
} from 'grommet';

import Loader from 'react-loader-spinner';

import Player from './player';

class Mixer extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    this.TOKEN_URL = 'https://mixify-server.herokuapp.com/getToken';
    this.state = {
      loaded: false,
      newToken: '',
      collaborators: [],
      collaboratorTokens: [this.props.mixOwner.token],
      tracks: [],
      playlistID: '',
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.refreshCollaboratorData = this.refreshCollaboratorData.bind(this);
    this.refreshCollaboratorDataHelper = this.refreshCollaboratorDataHelper.bind(this);
    this.mixx = this.mixx.bind(this);
  }

  async componentWillMount() {
    await this.refreshCollaboratorData();
    this.sleep(1500).then(() => { // here to show off the cool loading animation :)
      this.setState({ loaded: true });
    });
  }

  sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  startPlayback = (device_id) => {
    // sets the config with authorization of current collaborator's token
    console.log(device_id);
    const config = {
      headers: { Authorization: `Bearer ${this.props.mixOwner.token}` },
    };
    let body = {
      device_ids: [device_id],
      play: true,
    };
    axios.put(`${this.SPOTIFY_URL}/me/player`, body, config).then((response) => {
      console.log(response);
      body = {
        context_uri: `spotify:user:paperrapper:playlist:${this.state.playlistID}`,
      };
      axios.put(`${this.SPOTIFY_URL}/me/player/play`, body, config).then((response2) => {
        console.log(response2);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Retrieves user's data from Spotify API and adds the user to the database of this mix.
   */
  async addCollaborator() {
    // adds this collaborator's token to list of collaborators
    this.setState((prevState) => {
      prevState.collaboratorTokens.push(prevState.newToken);
      return (prevState);
    });
    // refreshes collaborator data
    await this.refreshCollaboratorData();
    console.log('is this running?');
  }

  /**
   * Refreshes all the collaborators' data by retrieiving the most up-to-date music preferences from Spotifty API.
   */
  async refreshCollaboratorData() {
    // creates new collaborators template
    const collaborators = [];
    for (let i = 0; i < this.state.collaboratorTokens.length; i += 1) {
      const collaborator = await this.refreshCollaboratorDataHelper(i);
      // adds collaborator to list
      collaborators.push(collaborator);
    }
    this.setState({
      collaborators,
    });
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
      token: this.state.collaboratorTokens[i],
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
      axios.get(`${this.SPOTIFY_URL}/me/top/tracks?limit=15`, config).then((response) => {
        response.data.items.forEach((track) => {
          const tempTrack = {
            name: '',
            id: '',
            uri: '',
            popularity: null,
            albumName: '',
            artists: [],
          };
          tempTrack.name = track.name;
          tempTrack.id = track.id;
          tempTrack.uri = track.uri;
          tempTrack.popularity = track.popularity;
          tempTrack.albumName = track.album.name;
          tempTrack.artists = track.artists.map(artist => artist.name);
          collaborator.topTracks.push(tempTrack);
        });
      }).catch((error) => {
        console.log(error);
      });
      console.log(collaborator.topTracks);
    });
    return collaborator;
  }

  /**
   * Mixes the playlist!
   */
  async mixx() {
    await this.refreshCollaboratorData();
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
      this.setState({ playlistID: response.data.id });

      // begins generating the local playlist
      let mixTracks = [];

      this.state.collaborators.forEach((collaborator) => {
        collaborator.topTracks.forEach((track) => {
          mixTracks.push(track);
        });
      });
      this.setState({ tracks: mixTracks });
      const mixTracksURIs = this.state.tracks.map(track => track.uri);

      // sets up the axios request body with the local playlist to be sent into Spotify API
      body = {
        uris: mixTracksURIs,
      };

      // posts the new local playlist to the Spotify API
      axios.post(`${this.SPOTIFY_URL}/playlists/${this.state.playlistID}/tracks`, body, config).then(() => {
        // yay!
        console.log('Mix successful!');
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  renderPlayer = () => {
    if (this.state.playlistID === '') {
      return (<Heading color="brand">Make a Mix to start playing!</Heading>);
    } else {
      return (<Player startPlayback={this.startPlayback} />);
    }
  }

  render() {
    if (!this.state.loaded || this.props.mixOwner.name === null) {
      return (<Loader type="Puff" height={200} color="#7D4CDB" width={200} />);
    } else {
      console.log(this.state.tracks);
      const collaborators = this.state.collaborators.map(collaborator => <Box key={collaborator.token} margin="small" flex="grow" pad="small" gap="small" round="medium" justify="center" align="center"><Text color="accent-4" textAlign="center" size="small">{collaborator.name}</Text></Box>);
      const tracks = this.state.tracks.map(track => <Box key={track.id} flex="grow" round="medium" direction="row" justify="between" align="center"><Text color="brand" textAlign="center" size="small" weight="bold">{track.name}</Text><Text color="brand" textAlign="center" size="small">{track.artists[0]}</Text></Box>);
      return (
        <Box id="mix" pad="medium">
          <Grid
            fill
            rows={['550px', '100px']}
            columns={['300px', '600px']}
            gap="small"
            areas={[
              { name: 'collaborators', start: [0, 0], end: [0, 0] },
              { name: 'mixer', start: [1, 0], end: [1, 0] },
              { name: 'player', start: [0, 1], end: [1, 1] },
            ]}
          >
            <Box gridArea="collaborators" border={{ size: 'medium', color: 'brand' }} pad="medium" gap="small" animation="fadeIn" justify="start" align="start" elevation="xlarge" round="large">
              <Heading color="brand" level="3">Welcome, {this.props.mixOwner.name}!</Heading>
              <Heading color="brand" level="5">Mix Collaborators</Heading>
              <Box align="start" justify="around">
                {collaborators}
              </Box>
              <Text size="small" textAlign="center" margin="small">
                Invite your friends music tastes. To add a friend, get their token from{' '}
                <a href={this.TOKEN_URL} target="_blank" rel="noopener noreferrer">
                  here
                </a>
              </Text>
              <TextInput placeholder="insert token here" value={this.state.newToken} onChange={event => this.setState({ newToken: event.target.value })} />
              <Button primary color="brand" hoverIndicator="true" onClick={this.addCollaborator} label="Add" />
            </Box>
            <Box gridArea="mixer" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              <Button primary color="brand" onClick={this.mixx} label="Mix" />
              <Box overflow="scroll" fill="horizontal" gap="small">
                {tracks}
              </Box>
            </Box>
            <Box gridArea="player" border={{ size: 'medium', color: 'brand' }} pad="large" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              {this.renderPlayer()}
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
  }
);

export default withRouter(connect(mapStateToProps, null)(Mixer));
