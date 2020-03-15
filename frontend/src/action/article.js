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

export const fetchArticleList = (option) => (dispatch) => {
  axios.put(v1port + '/article', option).then((res) => {
    console.log(res);
    dispatch({
      type: FETCH_ARTICLE_LIST,
    });
  })
};

export const postArticle = (
  id, boardname, title, summary, thumbnail, html, images,
) => (dispatch) => {
  axios.post(v1port + '/article', thumbnail
    ? { id, boardname, title, content: html, summary, thumbnail, images }
    : { id, boardname, title, content: html, summary, images }
  ).then((res) => {
    // history.push('/'+res.data.message)
    dispatch({
      type: POST_ARTICLE,
      data: res.data.message,
    });
  }).catch((err) => {
    alert(err);
  });
};

export const fetchArticle = (id) => (dispatch) => {
  axios.get(v1port + '/article/' + id).then(() => {

  }).catch(() => {

  });
};

export const editArticle = (
  id, title, summary, thumbnail, html,
) => (dispatch) => {
  axios.put(v1port + '/article/' + id).then(() => {

  }).catch(() => {

  });
};

export const deleteArticle = () => (dispatch) => {

};
