import buildClient from '../services/build-client';
import API_ENDPOINTS from '../services/routes';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(API_ENDPOINTS.USERS.CURRENT_USER);

  return data;
};

export default LandingPage;
