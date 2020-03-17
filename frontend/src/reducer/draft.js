import {
  FETCH_IMG,
  UPDATE_IMG,
  FETCH_HTML,
  UPDATE_HTML,
  POST_ARTICLE,
} from '../action/types';

const initialState = {
  // INVARIABLE : {filename(string) : base64encoded(string)}
  images: {},
  html: '',
  invalid: [],
  articleID: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_IMG:
      return { ...state, images: action.data, invalid: action.invalid };
    case UPDATE_IMG: {
      let origState = state;
      origState.images[action.filename] = action.encoded;
      return origState;
    }
    case FETCH_HTML:
      return { ...state, html: action.data };
    case UPDATE_HTML:
      return { ...state, html: action.data };
    case POST_ARTICLE:
      return { ...state, articleID: action.data };
    default:
      return state;
  }
}
