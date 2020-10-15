import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
} from "./types";

import AuthService from "../services/auth.service";

export const register = (user) => async (dispatch) => {
  var response = await AuthService.register(user);
  if(response.success === true){
      console.log(response)
      dispatch({
        type: REGISTER_SUCCESS,
      })
      dispatch({
        type: SET_MESSAGE,
        payload: response.message,
      })
      return response;
  }else{
      dispatch({
        type: REGISTER_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.message || response.error,
      });
      return response;
    }
}

export const login = (user) => async (dispatch) => {
  var response = await AuthService.login(user);
  if(response.success === false){
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.message || response.error,
      });
  }
  if(response.success === true){
    if (response.token) {
      localStorage.setItem("user", JSON.stringify(response));
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: response },
    });   
  }
  return response;
};

export const logout = (user) => (dispatch) => {
  // AuthService.logout(user);
  dispatch({
    type: LOGOUT,
  });
};

export const update = (user, token) => async (dispatch) => {
  var response = await AuthService.update(user, token);
  if(response.success === false){
      dispatch({
        type: UPDATE_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: response.message || response.error,
      });
  }
  if(response.success === true){
    if (response.token) {
      localStorage.setItem("user", JSON.stringify(response));
    }
    dispatch({
      type: UPDATE_SUCCESS,
      payload: { user: response },
    });   
  }
  return response;
};