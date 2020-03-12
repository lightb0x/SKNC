import axios from 'axios';

import {
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  CHANGE_PASSWORD,
  DELETE_USER,
  RESET_PASSWORD,
  SEARCH_USER,
  CHANGE_ROLE,
} from './types';

import { v1port } from '../settings';

export const signup = () => (dispatch) => {

}

export const signin = (username, password) => (dispatch) => {
  axios.post(v1port + "/signin", { username, password }).then((res) => {
    console.log(res)
    console.log('signin succeeded')
  }).catch((err) => {
    alert('아이디 또는 비밀번호가 잘못되었습니다')
  })
};

export const signout = () => (dispatch) => {
  axios.get(v1port + "/signout").then((res) => {
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

export const searchUser = () => (dispatch) => {

}

export const changeRole = () => (dispatch) => {

}
