import axios from 'axios';
import Cookies from 'js-cookie';

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
  DEFAULT,
} from './types';

import { v1port, cookieLogin, nologinRole, defaultRole } from '../settings';

export const signup = () => (dispatch) => {

}

export const signin = (username, password) => (dispatch) => {
  axios.post(v1port + "/signin", { username, password }).then((res) => {
    dispatch({
      type: SIGN_IN,
      signinFailed: false,
      role: res.data.role,
    });
  }).catch(() => {
    dispatch({
      type: SIGN_IN,
      signinFailed: true,
      role: nologinRole,
    })
  })
};

export const signout = () => (dispatch) => {
  axios.get(v1port + "/signout").then(() => {
    Cookies.remove(cookieLogin);
    dispatch({ type: SIGN_OUT })
  }).catch(() => {
    Cookies.remove(cookieLogin);
    dispatch({ type: SIGN_OUT })
  })
};

export const changePassword = () => (dispatch) => {

};

export const deleteUser = () => (dispatch) => {

}

export const resetPassword = () => (dispatch) => {

}

export const getRole = () => (dispatch, getState) => {
  const currentRole = getState().user.role;
  const token = Cookies.get(cookieLogin);
  if (currentRole === defaultRole && token != null) {
    axios.get(v1port + "/account/role").then((res) => {
      dispatch({ type: GET_ROLE, role: res.data })
    }).catch(() => {
      dispatch({ type: GET_ROLE, role: defaultRole })
    })
  } else if (token == null) {
    dispatch({ type: GET_ROLE, role: nologinRole })
  } else {
    dispatch({ type: DEFAULT })
  }
}

export const searchUser = () => (dispatch) => {

}

export const changeRole = () => (dispatch) => {

}
