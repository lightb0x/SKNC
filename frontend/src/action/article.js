import axios from 'axios';

import {
  FETCH_ARTICLE_LIST,
  POST_ARTICLE,
  FETCH_ARTICLE,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
  FETCH_COMMENTS,
} from './types'

import { v1port } from '../settings';

export const fetchArticleList = (id) => (dispatch) => {
  axios.put(v1port + '/article').then((res) => {
    console.log(res);
    dispatch({
      type: FETCH_ARTICLE_LIST,
    });
  })
};

export const postArticle = () => (dispatch) => {

};

export const fetchArticle = () => (dispatch) => {

  // TODO : use FETCH_COMMENTS
};

export const editArticle = () => (dispatch) => {

};

export const deleteArticle = () => (dispatch) => {

};
