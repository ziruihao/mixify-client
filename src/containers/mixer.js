/* eslint-disable no-await-in-loop */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// Grommet
import {
  Button, Heading, Text, TextInput, Box, Grid,
} from 'grommet';

// cool loader
import Loader from 'react-loader-spinner';

// web player
import Player from './player';

// actions
import { currentizeMix, updateLocalMix, updateMix } from '../actions';

class Mixer extends React.Component {
  constructor(props) {
    super(props);
    this.SPOTIFY_URL = 'https://api.spotify.com/v1';
    // this.TOKEN_URL = 'https://mixify-server.herokuapp.com/authCollaborator';
    this.TOKEN_URL = 'http://localhost:9090/authCollaborator';

    this.state = {
      mixHasLoaded: false,
      newToken: '',
      // localMix: {
      //   owner: null,
      //   collaborators: [this.props.user],
      //   tracks: [],
      //   spotifyPlaylistID: null,
      //   id: null,
      // },
    };
    this.addCollaborator = this.addCollaborator.bind(this);
    this.grabAllCollaboratorsData = this.grabAllCollaboratorsData.bind(this);
    this.grabCollaboratorData = this.grabCollaboratorData.bind(this);
    this.mixx = this.mixx.bind(this);
  }

  async componentWillMount() {
    // await this.grabAllCollaboratorsData();
    await this.props.currentizeMix(this.props.match.params.id, this.props.history);
    console.log(this.props.mix);
    if (this.props.user.name !== null) {
      let isNew = true;
      this.props.mix.collaborators.forEach((collaborator) => {
        if (collaborator.id === this.props.user.id) {
          isNew = false;
        }
      });
      if (isNew) {
        this.addCollaborator(this.props.user.token);
      }
    }
    this.sleep(1500).then(() => { // here to show off the cool loading animation :)
      this.setState({ mixHasLoaded: true });
    });
  }

  sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  startPlayback = async (device_id) => {
    // sets the config with authorization of current collaborator's token
    console.log(device_id);
    const config = {
      headers: { Authorization: `Bearer ${this.props.user.token}` },
    };
    let body = {
      device_ids: [device_id],
      play: true,
    };

    try {
      await axios.put(`${this.SPOTIFY_URL}/me/player`, body, config);
    } catch (error) {
      console.log(error);
    }

    body = {
      context_uri: `spotify:user:${this.props.user.id}:playlist:${this.props.mix.spotifyPlaylistID}`,
    };

    try {
      await axios.put(`${this.SPOTIFY_URL}/me/player/play`, body, config);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Shuffled an array.
   */
  shuffle = (array) => {
    const shuffledArray = Object.assign([], array);
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  /**
   * Retrieves user's data from Spotify API and adds the user to the database of this mix.
   */
  async addCollaborator(token) {
    // adds this collaborator's token to list of collaborators
    // this.setState((prevState) => {
    //   prevState.collaboratorTokens.push(prevState.newToken);
    //   return (prevState);
    // });

    // refreshes collaborator data
    const collaborator = await this.grabCollaboratorData(token);
    // grabs the most recent list of collaborators from redux store, adds this new collaborator to it
    const collaborators = Object.assign([], this.props.mix.collaborators);
    console.log(collaborators);
    collaborators.push(collaborator);
    // sends in for redux update
    this.props.updateLocalMix({ collaborators });
    // console.log(this.props.mix.collaborators);
    this.props.updateMix(this.props.mix, this.props.mix.id);
  }

  /**
   * Refreshes all the collaborators' data by retrieiving the most up-to-date music preferences from Spotifty API.
   */
  async grabAllCollaboratorsData() {
    // creates new collaborators template
    const collaborators = [];
    for (let i = 0; i < this.props.mix.collaborators.length; i += 1) {
      const collaborator = await this.sleep(10).then(() => this.grabCollaboratorData(this.state.collaboratorTokens[i]));
      // adds collaborator to list
      collaborators.push(collaborator);
    }
    this.props.updateLocalMix({ collaborators });
    // this.setState({
    //   collaborators,
    // });
  }

  /**
   * Heplper function to atomize the asynchornize process of freshing collaborator data.
   * @param {Number} i
   */
  async grabCollaboratorData(token) {
    // sleep is necessary to not get rejected by Spotify API for too many requests too fast
    // await this.sleep(10);

    // creates a new collaborator template
    const collaborator = {
      name: '',
      id: '',
      token,
      topTracks: [],
    };

    // sets the config with authorization of current collaborator's token
    const config = {
      headers: { Authorization: `Bearer ${collaborator.token}` },
    };

    // retrieves collaborator's account data
    try {
      const response = await axios.get(`${this.SPOTIFY_URL}/me`, config);
      collaborator.name = response.data.display_name;
      collaborator.id = response.data.id;
    } catch (error) {
      console.log(error);
    }

    // retrieves collaborator's musical preferences
    try {
      const response = await axios.get(`${this.SPOTIFY_URL}/me/top/tracks?limit=15`, config);
      response.data.items.forEach((track) => {
        const tempTrack = {
          name: track.name,
          id: track.id,
          uri: track.uri,
          popularity: track.popularity,
          albumName: track.album.name,
          artistNames: track.artists.map(artist => artist.name),
          fromUser: {
            name: collaborator.name,
            id: collaborator.id,
          },
        };
        collaborator.topTracks.push(tempTrack);
      });
    } catch (error) {
      console.log(error);
    }
    return collaborator;
  }

  /**
   * Mixes the playlist!
   */
  async mixx() {
    // await this.grabAllCollaboratorsData();
    console.log('begining to mix');
    // sets up axios headers with the necessary tokens
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.mix.owner.token}`,
        'Content-Type': 'application/json',
      },
    };

    // sets up the axios request bodt with the name and description of the playlist to be made
    let body = {
      name: 'Mixify',
      description: 'For the aux king.',
    };
    try {
      const response = await axios.post(`${this.SPOTIFY_URL}/users/${this.props.mix.owner.token}/playlists`, body, config);
      await this.props.updateLocalMix({ spotifyPlaylistID: response.data.id });
      // this.setState(prevState => ({
      //   mix: Object.assign({}, prevState, { spotifyPlaylistID: response.data.id }),
      // }));
    } catch (error) {
      console.log(error);
    }

    // begins generating the local playlist
    const mixTracks = [];

    this.props.mix.collaborators.forEach((collaborator) => {
      collaborator.topTracks.forEach((track) => {
        mixTracks.push(track);
      });
    });

    await this.props.updateLocalMix({ tracks: mixTracks });
    // this.setState(prevState => ({
    //   mix: Object.assign({}, prevState, { tracks: mixTracks }),
    // }));

    const mixTracksURIs = this.props.mix.tracks.map(track => track.uri);

    // sets up the axios request body with the local playlist to be sent into Spotify API
    body = {
      uris: mixTracksURIs,
    };

    // posts the new local playlist to the Spotify API
    try {
      await axios.post(`${this.SPOTIFY_URL}/playlists/${this.props.mix.spotifyPlaylistID}/tracks`, body, config);
    } catch (error) {
      console.log(error);
    }
  }

  renderPlayer = () => {
    // if (this.props.mix.spotifyPlaylistID === '') {
    //   return (<Heading alignSelf="center" color="brand" textAlign="center" level="5">Make a Mix to start playing!</Heading>);
    // } else {
    //   return (<Player startPlayback={this.startPlayback} />);
    // }
  }

  renderTracks = () => {
    if (this.props.mix.spotifyPlaylistID === '') {
      return (<Box fill justify="center" align="center"><Loader type="Puff" height={90} width={90} color="#7D4CDB" /></Box>);
    } else {
      const tracks = this.props.mix.tracks.map(track => <Box key={track.id} flex="grow" round="medium" direction="row" justify="between" align="center"><Text color="brand" textAlign="center" size="small" weight="bold">{track.name}</Text><Text color="brand" textAlign="center" size="small">{track.artistNames[0]}</Text></Box>);
      return (tracks);
    }
  }

  render() {
    if (!this.state.mixHasLoaded) {
      return (<Loader type="Puff" height={200} width={200} color="#7D4CDB" />);
    } else if (this.props.mix === null) {
      return (<Text>404: Mix not found. </Text>);
    } else {
      const collaborators = this.props.mix.collaborators.map(collaborator => <Box key={collaborator.token} pad="small" gap="small" round="medium" justify="evenly" align="stretch"><Text textAlign="start" size="small">{collaborator.name}</Text></Box>);
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
              <Heading color="brand" level="3">Welcome, {this.props.user.name}!</Heading>
              <Text color="neutral-2" size="medium" weight="bold">Mix Collaborators</Text>
              <Box alignContent="start" justify="start" pad={{ left: 'xsmall' }} fill gap="xsmall">
                Owner: {this.props.mix.owner.name}{collaborators}
              </Box>
              <Text size="small" textAlign="start">
                Invite your {'friend\'s'} music tastes. To add a friend, get their token from{' '}
                <a href={this.TOKEN_URL} target="_blank" rel="noopener noreferrer">
                  here.
                </a>
                 Open in incognito.
              </Text>
              <TextInput placeholder="insert token here" value={this.state.newToken} onChange={event => this.setState({ newToken: event.target.value })} />
              <a href={`${this.TOKEN_URL}?mixId=${this.props.mix.id}`}>
                <Button primary color="brand" alignSelf="center" hoverIndicator="true" label="Join Collab" />
              </a>
            </Box>
            <Box gridArea="mixer" border={{ size: 'medium', color: 'brand' }} pad="medium" gap="medium" animation="fadeIn" justify="start" align="stretch" alignContent="stretch" elevation="xlarge" round="large">
              <Button primary color="brand" alignSelf="center" onClick={this.mixx} label="Mix it!" />
              <Box overflow="scroll" fill gap="small" pad={{ horizontal: 'small' }}>
                {this.renderTracks()}
              </Box>
            </Box>
            <Box gridArea="player" border={{ size: 'medium', color: 'brand' }} pad={{ horizontal: 'large', vertical: 'medium' }} animation="fadeIn" justify="center" align="stretch" elevation="xlarge" round="large">
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
    user: state.auth,
    mix: state.mixes.current,
  }
);

export default withRouter(connect(mapStateToProps, { currentizeMix, updateLocalMix, updateMix })(Mixer));
