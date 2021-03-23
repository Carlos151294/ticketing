import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../services/build-client';
import Header from '../components/header';
import API_ENDPOINTS from '../services/routes';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get(API_ENDPOINTS.USERS.CURRENT_USER);

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }
  
  return {
    pageProps,
    currentUser: data.currentUser
  };
};

export default AppComponent;