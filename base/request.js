import axios from 'axios';
import session from './session';

export const { serverBaseUrl } = session;

axios.defaults.baseURL = serverBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

let axiosInstance = null;

/* eslint no-param-reassign: ["error", { "props": false }] */
function request(options = {}) {
  axiosInstance = axiosInstance || axios.create();

  options.headers = {
    Authorization: `Bearer ${session.currentAccount.accessToken}`,
    'Content-Type': 'application/json',
    'X-Tenant-Id': session.currentAccount.tenantId,
    ...options.headers,
  };

  return axiosInstance(options)
    .then((response) => response.data)
    .catch((err) => {
      let { message } = err;

      if (err.response) {
        const { data } = err.response;
        // eslint-disable-next-line no-param-reassign
        message = data.summary || data.error_description || data.error || data.status || message;
      }

      throw Error(message);
    });
}

function loadItemId(type, criteria) {
  const options = {
    url: `setup/${type}`,
    method: 'GET',
    params: { ...criteria, only: 'id', limit: 1 },
  };

  return request(options).then((response) => ((response.count !== 0) ? response.items[0].id : null));
}

export { session, request, loadItemId };
