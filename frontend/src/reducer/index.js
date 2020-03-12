import { combineReducers } from 'redux';
import draftReducer from './draft';
import articleReducer from './article';
import commentReducer from './comment';
import userReducer from './user';

export default combineReducers({
  draft: draftReducer,
  article: articleReducer,
  comment: commentReducer,
  user: userReducer,
});
