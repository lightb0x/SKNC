import {
  SIGN_IN,
  SIGN_OUT,
  CHANGE_PASSWORD,
} from '../action/types';

const initialState = {

};

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
    case SIGN_OUT:
    case CHANGE_PASSWORD:
    default:
      return state;
  }
}