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

function extCheck(s) {
  switch (s) {
    case "png":
    case "jpg":
    case "jpeg":
      return true;
    default: {
      return s.lastIndexOf('.') < 0
        ? false
        : extCheck(s.slice(s.lastIndexOf('.') + 1));
    }
  }
}

export const fetchImages = (id) => (dispatch) => {
  axios.get(v1port + '/draft/img?id=' + id).then((res) => {
    let invalid = [];
    // `images` is in order, because of the way Object.keys() works
    // The ordering of the properties is the same as that
    // given by looping over the properties of the object manually.
    Object.keys(res.data).map(function (item) {
      if (!extCheck(item)) {
        invalid.push(item);
      }
      return null;
    });
    dispatch({
      type: FETCH_IMG,
      data: res.data,
      invalid,
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
    // string replace: `./archive/:id~` -> `/archive/:id`
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
