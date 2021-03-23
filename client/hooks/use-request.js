import axios from 'axios';
import { useState } from 'react';

const Errors = ({ errors }) => (
  <div className="alert alert-danger">
    <h4>Ooops...</h4>
    <ul className="my-0">
      {errors.map((error) => (
        <li key={error.message}>{error.message}</li>
      ))}
    </ul>
  </div>
);

const useRequest = () => {
  const [errors, setErrors] = useState(null);

  const doRequest = async ({ url, method, body, onSuccess }) => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) onSuccess(response.data);
      return { data: response.data };
    } catch (error) {
      setErrors(<Errors errors={error.response.data.errors} />);
      return { error: error.response.data.errors };
    }
  };

  return { doRequest, errors };
};

export default useRequest;
