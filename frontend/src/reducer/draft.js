import {
  UPLOAD_DOCX,
  FETCH_IMG,
  FETCH_HTML,
} from '../action/types';

const initialState = {

};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPLOAD_DOCX:
    case FETCH_IMG:
    case FETCH_HTML:
    default:
      return state;
  }
}
