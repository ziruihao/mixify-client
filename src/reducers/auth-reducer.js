import { ActionTypes } from '../actions';

const initialState = {
  token: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_TOKEN:
      return (Object.assign({}, state, {
        token: action.payload,
      }));
    default:
      return state;
  }
};

export default AuthReducer;
