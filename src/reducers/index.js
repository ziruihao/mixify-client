import { combineReducers } from 'redux';

import AuthReducer from './auth-reducer';
import MusicReducer from './music-reducer';
import MixReducer from './mix-reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  music: MusicReducer,
  mixes: MixReducer,
});

export default rootReducer;
