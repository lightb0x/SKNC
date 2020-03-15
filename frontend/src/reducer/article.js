import {
  FETCH_ARTICLE_LIST,
  POST_ARTICLE,
  FETCH_ARTICLE,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
} from '../action/types';

// TODO : separate draft from article
const initialState = {
  article: {
    // boardname": article.Boardname,
    // "writer":    writer.Username,
    // "title":     article.Title,
    // "content":   article.Content,
    // "count":     article.Count + 1,
    // "createdAt": article.CreatedAt,
    // "updatedAt": article.UpdatedAt,
    // "isUpdated": article.UpdatedAt.After(article.CreatedAt),
    boardname: '',
    writer: '',
    title: '',
    content: '',
    count: 0,
    createdAt: Date(),
    updatedAt: Date(),
    isUpdated: false
    // comments: [], // TODO : comment redux or here ?
  },
  articleList: [],
  lastTime: null,
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