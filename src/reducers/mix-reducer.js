import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  current: null,
};

const MixReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CURRENTIZE_MIX:
      console.log(action.payload);
      return (Object.assign({}, state, {
        current: action.payload,
      }));
    case ActionTypes.MAKE_MIX:
      return (Object.assign({}, state, {
        current: action.payload,
      }));
    case ActionTypes.UPDATE_MIX:
      return (Object.assign({}, state, {
        current: action.payload,
      }));
    case ActionTypes.REMOVE_MIX:
      return (Object.assign({}, state, {
        current: null,
      }));
    case ActionTypes.FETCH_MIXES:
      return (Object.assign({}, state, {
        all: action.payload,
      }));
    default:
      return state;
  }
};

export default MixReducer;
