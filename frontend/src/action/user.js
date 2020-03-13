import axios from 'axios';
import Cookie from 'js-cookie';

import {
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  CHANGE_PASSWORD,
  DELETE_USER,
  RESET_PASSWORD,
  GET_ROLE,
  SEARCH_USER,
  CHANGE_ROLE,
} from './types';

import { v1port, cookieLogin } from '../settings';

export const signup = () => (dispatch) => {

}

export const signin = (username, password) => (dispatch) => {
  axios.post(v1port + "/signin", { username, password }).then(() => {
    axios.get(v1port + "/account/role").then((res) => { console.log(res) })
    dispatch({
      type: SIGN_IN,
      signinFailed: false,
    });
  }).catch(() => {
    dispatch({
      type: SIGN_IN,
      signinFailed: true,
    })
  })
};

export const signout = () => (dispatch) => {
  axios.get(v1port + "/signout").then((res) => {
    Cookie.remove(cookieLogin)
    console.log(res)
    console.log('signout succeeded')
  }).catch((err) => {
    console.log(err)
    console.log('signout failed')
  })
};

export const changePassword = () => (dispatch) => {

};

export const deleteUser = () => (dispatch) => {

}

export const resetPassword = () => (dispatch) => {

}

export const getRole = () => (dispatch, getState) => {
  axios.get(v1port + "/account/role").then((res) => { console.log(res) })
  const notLoggedIn = 'nologin';
  const currentRole = getState().user.role;
  if (currentRole === notLoggedIn && Cookie.get(cookieLogin) == null) {
    dispatch({
      type: GET_ROLE,
      role: notLoggedIn,
    })
  } else {
    axios.get(v1port + "/account/role").then((res) => {
      dispatch({
        type: GET_ROLE,
        role: res,
      })
    }).catch(() => {
      dispatch({
        type: GET_ROLE,
        role: notLoggedIn,
      })
    })
  }
}

export const searchUser = () => (dispatch) => {

}

export const changeRole = () => (dispatch) => {

}
