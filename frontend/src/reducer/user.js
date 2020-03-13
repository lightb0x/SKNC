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
} from '../action/types';

const notLoggedIn = 'nologin';
const initialState = {
  signinFailed: false,
  searchResult: {},
  role: notLoggedIn,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGN_UP:
    case SIGN_IN: {
      return { ...state, signinFailed: action.signinFailed };
    }
    case SIGN_OUT: {
      return { ...state, role: notLoggedIn }
    }
    case CHANGE_PASSWORD:
    case DELETE_USER:
    case RESET_PASSWORD:
    case GET_ROLE:
      return { ...state, role: action.role }
    case SEARCH_USER:
    case CHANGE_ROLE:
    default:
      return state;
  }
}