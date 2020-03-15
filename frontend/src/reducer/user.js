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

import { nologinRole, defaultRole } from '../settings';

const initialState = {
  signinFailed: false,
  searchResult: {},
  role: defaultRole,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGN_UP:
    case SIGN_IN:
      return { ...state, signinFailed: action.signinFailed, role: action.role };
    case SIGN_OUT:
      return { ...state, role: nologinRole }
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