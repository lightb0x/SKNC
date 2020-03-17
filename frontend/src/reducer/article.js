import {
  FETCH_ARTICLE_LIST,
  FETCH_ARTICLE,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
  ERROR_ARTICLE,
} from '../action/types';

// TODO : separate draft from article
const initialState = {
  article: {
    boardname: '',
    writer: '',
    title: '',
    content: '',
    comments: [],
    count: 0,
    createdAt: null, // Date() object
    updatedAt: null, // Date() object
    isUpdated: false,
    // comments: [], // TODO : comment redux or here ?
  },
  articleList: [],
  lastTime: null, // Date() object
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTICLE_LIST:
      return { ...state, articleList: action.data, lastTime: action.lastTime };
    case FETCH_ARTICLE:
      return { ...state, article: action.data };
    case ERROR_ARTICLE:
      return { ...state, error: action.error };
    case EDIT_ARTICLE: // TODO
    case DELETE_ARTICLE: // TODO
    default:
      return state;
  }
}