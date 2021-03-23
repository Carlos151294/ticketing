const BASE = '/api';
const USERS = BASE + '/users';

const API_ENDPOINTS = { 
  USERS: {
    SING_UP: `${USERS}/signup`,
    SING_IN: `${USERS}/signin`,
    SING_OUT: `${USERS}/signout`,
    CURRENT_USER: `${USERS}/currentuser`,
  }
};

export const METHODS = {
  GET: 'get',
  POST: 'post',
};

export default API_ENDPOINTS;