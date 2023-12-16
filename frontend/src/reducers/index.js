import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import admin from './admin';
import result from './result';

export default combineReducers({
  auth,
  alert,
  admin,
  result,
});