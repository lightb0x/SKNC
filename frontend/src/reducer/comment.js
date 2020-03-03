import {
  POST_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from '../action/types';

const initialState = {

};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_COMMENT:
    case EDIT_COMMENT:
    case DELETE_COMMENT:
    default:
      return state;
  }
}