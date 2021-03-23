import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';
import API_ENDPOINTS, { METHODS } from '../../services/routes';

const SignOut = () => {
  const { doRequest } = useRequest();

  const signOut = async () => {
    await doRequest({
      url: API_ENDPOINTS.USERS.SING_OUT,
      method: METHODS.POST,
      body: {},
      onSuccess: () => Router.push('/')
    });
  };

  useEffect(() => {
    signOut();
  }, []);

  return <div>Signing out...</div>
};

export default SignOut;