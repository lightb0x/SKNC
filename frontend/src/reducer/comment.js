import {
  FETCH_COMMENTS,
  POST_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
} from '../action/types';

const initialState = {
  // "comments":  comments,
  comments: [],
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