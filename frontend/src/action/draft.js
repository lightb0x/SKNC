import axios from 'axios';
import { Base64 } from 'js-base64';

import {
  FETCH_IMG,
  UPDATE_IMG,
  FETCH_HTML,
  UPDATE_HTML,
  DEFAULT,
} from './types';

import { v1port } from '../settings';

function extToMIME(ext) {
  const prefix = 'image/';
  switch (ext) {
    case "png":
      return prefix + ext;
    case 'jpg':
    case 'jpeg':
      return prefix + 'jpeg';
    default:
      return ext;
  }
}

function getExt(filename) {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex < 0) {
    return;
  } else {
    return filename.slice(dotIndex + 1);
  }
}

// TODO : header (data:image/jpeg;base64,) should not be included in data
//        instead, 
function prefix(filename) {
  const mime = extToMIME(getExt(filename));
  if (mime.includes('/')) {
    return "data:" + extToMIME(getExt(filename)) + ";base64,";
  } else {
    return mime;
  }
}

export const fetchImages = (id) => (dispatch) => {
  axios.get(v1port + '/draft/img?id=' + id).then((res) => {
    let invalidExt = '';
    Object.keys(res.data).map(function (item) {
      const pf = prefix(item);
      if (pf.includes('/')) {
        res.data[item] = pf + res.data[item];
      } else {
        invalidExt = pf;
      }
      return null;
    });
    dispatch({
      type: FETCH_IMG,
      data: res.data,
      invalid: invalidExt,
    });
  }).catch(() => {
    dispatch({ type: DEFAULT });
  });
};

export const updateImage = (filename, encoded) => (dispatch) => {
  dispatch({
    type: UPDATE_IMG,
    filename,
    encoded,
  });
};

export const fetchHTML = (id) => (dispatch) => {
  axios.get(v1port + '/draft/html?id=' + id).then((res) => {
    // TODO : string replace: `./archive/:id~` -> `/archive/:id`
    const raw = Base64.decode(res.data.data);
    const regex = new RegExp('./archive/' + id, 'g');
    const replace = '/archive/' + id;
    dispatch({
      type: FETCH_HTML,
      data: raw.replace(regex, replace),
    });
  }).catch(() => {
    dispatch({ type: DEFAULT });
  });
};

export const updateHTML = (html) => (dispatch) => {
  dispatch({
    type: UPDATE_HTML,
    data: html,
  });
};
