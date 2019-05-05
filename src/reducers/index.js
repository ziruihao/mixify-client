import { combineReducers } from 'redux';

import AuthReducer from './auth-reducer';
import MusicReducer from './music-reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  music: MusicReducer,
});

export default rootReducer;
