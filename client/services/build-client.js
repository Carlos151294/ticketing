import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // We have to add headers manually when sending requests from server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // We are on the browser
    // Header are handler automatically by the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;