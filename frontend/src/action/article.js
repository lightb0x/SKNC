import axios from 'axios';

import {
  FETCH_ARTICLE_LIST,
  POST_ARTICLE,
  FETCH_ARTICLE,
  EDIT_ARTICLE,
  DELETE_ARTICLE,
  ERROR_ARTICLE,
  FETCH_COMMENTS,
} from './types'

import { v1port } from '../settings';

export const fetchArticleList = (boardname, searchType, searchKeyword,
  numArticles, lastTime) => (dispatch) => {
    axios.put(v1port + '/article', {
      boardname,
      searchType,
      searchKeyword,
      numArticles,
      lastTime,
    }).then((res) => {
      console.log(res);
      const rcv = res.data;
      const lt = rcv.pop();
      dispatch({
        type: FETCH_ARTICLE_LIST,
        data: rcv,
        lastTime: lt,
      });
    })
  };

export const postArticle = (
  draftID, boardname, title, summary, thumbnail, html, images,
) => (dispatch) => {
  // transform `images` (object -> list)
  let sendImages = [];
  Object.keys(images).map(function (item) {
    const ext = item.slice(item.lastIndexOf('.') + 1);
    // data:image/jpeg;base64,
    let prefix = '';
    const pf = "data:image/";
    const sf = ";base64,";
    switch (ext) {
      case "jpeg":
      case "jpg":
        prefix = pf + "jpeg" + sf;
        break;
      case "png":
        prefix = pf + ext + sf;
        break;
      default:
      // will be error on backend anyway
    }
    sendImages.push(prefix + images[item]);
    return null;
  });
  axios.post(v1port + '/article', thumbnail
    ? {
      draftID, boardname, title, content: html, summary, thumbnail,
      sendImages
    }
    : { draftID, boardname, title, content: html, summary, sendImages }
  ).then((res) => {
    // history.push('/'+res.data.message)
    dispatch({
      type: POST_ARTICLE,
      data: res.data.message,
    });
  }).catch((err) => {
    console.log(err);
    alert('등록에 실패했습니다! 콘솔창(F12 또는 Ctrl + Shift + I)을 확인하세요');
  });
};

export const fetchArticle = (id) => (dispatch) => {
  axios.get(v1port + '/article/' + id).then((res) => {
    dispatch({
      type: FETCH_ARTICLE,
      data: res.data,
    });
  }).catch((err) => {
    dispatch({
      type: ERROR_ARTICLE,
      error: err,
    });
  });
};

// TODO : fetchEditArticle (IMAGES SHOULD BE DIFFERENT!)

export const editArticle = (
  id, title, summary, thumbnail, thumbnailExt, html,
) => (dispatch) => {
  axios.put(v1port + '/article/' + id).then(() => {

  }).catch(() => {

  });
};

export const deleteArticle = () => (dispatch) => {

};
