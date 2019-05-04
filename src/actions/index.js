import axios from 'axios';

export const ActionTypes = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
};

const ROOT_URL = 'https://mixify-server.herokuapp.com';
const API_KEY = '?key=zirui_hao';

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
