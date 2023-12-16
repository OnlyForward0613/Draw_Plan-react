import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    LOGIN_FAIL,
  } from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    role : false,
    errors: []
  };
  
  function authReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload
        };
      case LOGIN_FAIL:  
        return {
          ...state,
          errors: [...state.errors, ...payload]
        }
      case LOGIN_SUCCESS:
        const  {role} = payload;
        return {
          ...state,
          role,
          isAuthenticated: true,
          loading: false,
          user: payload
        };
      case AUTH_ERROR:
      case LOGOUT:
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null
        };
      default:
        return state;
    }
  }
  
  export default authReducer;