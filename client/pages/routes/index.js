const HOME = '/';
const AUTH = '/auth';

const APP_ROUTES = { 
  HOME,
  AUTH: {
    SING_UP: `${AUTH}/signup`,
    SING_IN: `${AUTH}/signin`,
    SING_OUT: `${AUTH}/signout`,
  }
};

export default APP_ROUTES;