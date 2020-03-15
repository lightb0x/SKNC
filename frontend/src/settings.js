// you can change board names OR add boards here
// WARNING: board names should not be too long
//          small-size screen devices (iphone5, galaxy s5, ...)
export const boards = {
  'lite': ['논총Lite', '본글의 가벼운 요약'],
  'main': ['본글', '지성의 세계'],
  'oasis': ['오아시스', '현대인의 오아시스'],
  'square': ['광장', '자유로운 토론광장'],
};

export const staffOnly = ['lite', 'main', 'oasis'];
export const allUser = ['square'];

export const title = 'ㅅㄱㄴㅊ';

// first element is default value
export const searchType = ['제목', '저자', '내용'];

export const numArticlesOnHeader = 5;
export const numArticlesPerRequest = 5;


export const backend = '';
export const v1port = backend + '/api/v1';

export const cookieLogin = 'sessionid';

export const adminRole = 'admin';
export const staffRole = 'staff';
export const userRole = 'user';
export const tempRole = 'temp';

// no-login value for role
export const nologinRole = 'nologin';
// default value for role
export const defaultRole = 'default';
