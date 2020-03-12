import {
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  CHANGE_PASSWORD,
  DELETE_USER,
  RESET_PASSWORD,
  SEARCH_USER,
  CHANGE_ROLE,
} from '../action/types';

const initialState = {
  searchResult: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGN_UP:
    case SIGN_IN:
    case SIGN_OUT:
    case CHANGE_PASSWORD:
    case DELETE_USER:
    case RESET_PASSWORD:
    case SEARCH_USER:
    case CHANGE_ROLE:
    default:
      return state;
  }
}