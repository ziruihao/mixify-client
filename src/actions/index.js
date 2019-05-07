import axios from 'axios';

export const ActionTypes = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  SAVE_USER: 'SAVE_USER',
  GET_AUDIO_FEATURES: 'GET_AUDIO_FEATURES',
  CURRENTIZE_MIX: 'CURRENTIZE_MIX',
  MAKE_MIX: 'MAKE_POST',
  UPDATE_MIX: 'UPDATE_MIX',
  REMOVE_MIX: 'REMOVE_MIX',
  FETCH_MIXES: 'FETCH_MIXES',
};

// custom-built authentication node.js mixify-server
// const ROOT_URL = 'https://mixify-server.herokuapp.com';
const ROOT_URL = 'http://localhost:9090';
// Spotify's API
const SPOTIFY_URL = 'https://api.spotify.com/v1';

/**
 * Saves the user authentication token to redux store and configures axios headers.
 * @param {String} token
 */
export function saveUser(user) {
  axios.defaults.headers.common = { Authorization: `Bearer ${user.token}` };
  return {
    type: ActionTypes.SAVE_USER,
    payload: user,
  };
}

/**
 * Requests mixify-server to serve login process.
 */
export function requestLogin() {
  return () => {
    axios.get(`${ROOT_URL}/login`).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
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

// MIX

/**
 * Fetches all the mixes.
 */
export function fetchMixes() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/mixes`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_MIXES, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

/**
 * Makes a mix the current mix.
 * @param {String} id
 */
export function currentizeMix(id, history) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/mixes/${id}`).then((response) => {
      dispatch({ type: ActionTypes.CURRENTIZE_MIX, payload: response.data });
      history.push(`/${id}`);
    }).catch((error) => {
      console.log(error);
    });
  };
}

/**
 * Creates a new mix.
 * @param {Object} mix
 */
export function createMix(mix) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/mixes`, mix).then(() => {
      fetchMixes()(dispatch);
    }).catch((error) => {
      console.log(error);
    });
  };
}

/**
 * Makes changes to a mix.
 * @param {Object} mixUpdate
 * @param {String} id
 */
export function updateMix(mixUpdate, id) {
  return (dispatch) => {
    console.log(ROOT_URL);
    axios.put(`${ROOT_URL}/mixes/${id}`, mixUpdate).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_MIX, payload: response.data });
    }).catch((error) => {
      console.log(error);
    });
  };
}

/**
 * Removes a mix.
 * @param {String} id
 * @param {Object} history
 */
export function removeMix(id, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/mixes/${id}$`).then((response) => {
      console.log(response);
      fetchMixes()(dispatch);
      dispatch({ type: ActionTypes.REMOVE_MIX, payload: null });
      history.push('/');
    }).catch((error) => {
      console.log(error);
    });
  };
}
