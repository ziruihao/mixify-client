import { ActionTypes } from '../actions';

const initialState = {
  name: null,
  id: null,
  token: null,
  topTracks: [],
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_USER:
      return action.payload;
    default:
      return state;
  }
};

export default AuthReducer;
