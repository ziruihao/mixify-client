import axios from 'axios';

export const ActionTypes = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  SAVE_TOKEN: 'SAVE_TOKEN',
  GET_AUDIO_FEATURES: 'GET_AUDIO_FEATURES',
};

// custom-built authentication node.js mixify-server
const ROOT_URL = 'https://mixify-server.herokuapp.com';
// Spotify's API
const SPOTIFY_URL = 'https://api.spotify.com/v1';

/**
 * Saves the user authentication token to redux store and configures axios headers.
 * @param {String} token
 */
export function saveToken(token) {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
  return {
    type: ActionTypes.SAVE_TOKEN,
    payload: token,
  };
}

/**
 * Grabs cool audio insights from Spotify's API for a song.
 * @param {String} id
 */
export function getAudioFeatures(id) {
  return (dispatch) => {
    axios.get(`${SPOTIFY_URL}/audio-features/${id}`).then((response) => {
      dispatch({ type: ActionTypes.GET_AUDIO_FEATURES, payload: response.data });
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };
}

/**
 * Requests server to serve login process.
 */
export function requestLogin() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/login`).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };
}
