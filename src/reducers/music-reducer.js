import { ActionTypes } from '../actions';

const initialState = {
  audioFeatures: null,
};

const MusicReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_AUDIO_FEATURES:
      return (Object.assign({}, state, {
        audioFeatures: action.payload,
      }));
    default:
      return state;
  }
};

export default MusicReducer;
