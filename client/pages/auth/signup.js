import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';
import API_ENDPOINTS from '../../services/routes';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest();

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest({ 
      url: API_ENDPOINTS.USERS.SING_UP, 
      method: 'post',
      body: { email, password },
      onSuccess: () => Router.push('/')
    });
  };

  return (
    <form>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button onClick={onSubmit} className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
