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
        name: '',
        collaboratorTokens: [],
        tracks: [],
      },
    };
  }

  componentWillMount() {
    this.props.currentizeMix(this.props.match.params.mixID, this.props.history);
  }

  componentDidUpdate() {
    if (!(this.props.mix === null) && !this.state.firstRefresh) {
      this.refreshCollaboratorData();
      console.log('refreshing');
      this.state.firstRefresh = true;
    }
  }

  // sleep time expects milliseconds
  sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }


  refreshCollaboratorData = () => {
    return new Promise((resolve) => {
      const collaborators = [];
      for (let i = 0; i < this.props.mix.collaboratorTokens.length; i += 1) {
        this.sleep(0).then(() => {
          console.log(i);
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
      return resolve();
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
    this.refreshCollaboratorData().then(() => {
      this.sleep(3000).then(() => {
        console.log('this should happen after the promise returns!');
        let playlistID = '';
        const config = {
          headers: {
            Authorization: `Bearer ${this.props.mixOwner.token}`,
            'Content-Type': 'application/json',
          },
        };
        let body = {
          name: 'Mixx!',
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
    });
  }


  render() {
    if (this.props.mix === null) {
      return (<div>404: post not found</div>);
    } else if (!this.state.firstRefresh) {
      return (<div>loading</div>);
    } else {
      console.log(this.state.collaborators);
      console.log(this.state.collaborators.map(collaborator => collaborator.name));
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
