import {
  FETCH_ARTICLE_LIST,
  POST_ARTICLE,
  FETCH_ARTICLE,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
} from '../action/types';

const initialState = {
  draftImgs: [],
  draftHTML: "",
  article: {},
  articleList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTICLE_LIST:
    case POST_ARTICLE:
    case FETCH_ARTICLE:
    case EDIT_ARTICLE:
    case DELETE_ARTICLE:
    default:
      return state;
  }
}