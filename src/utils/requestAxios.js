import axios from 'axios';
import qs from 'qs';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { notification } from 'antd';
import { baseUrl, oauthLoginUrl } from './utils';
import router from 'umi/router';

axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;

const doDecode = (json) => {
  return eval(`(${json})`);
};

const fetch = (options) => {

  const { method = 'get', data, appendParams = {} } = options;
  let { url, hasUrl = false } = options;
  const cloneData = lodash.cloneDeep({ ...data, ...appendParams });

  try {
    let domainName = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domainName] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = hasUrl ? url : url.slice(domainName.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
  } catch (e) {
    // notification.error({
    //   message: e.message,
    // });
  }
  if (data instanceof FormData) {
    // axios.defaults.withCredentials = false; // 设置不带cookie 不然存在跨域问题
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  switch (method.toLowerCase()) {
    case 'get':
      if (options.fetchType === 'blob') {
        return axios({
          method: 'get',
          url,
          params: cloneData,
          responseType: 'blob',
        });
      }
      return axios.get(url, {
        params: cloneData,
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      });
    case 'post':
      return axios.post(url, qs.stringify(cloneData, {
        indices: false,
      }));
    case 'put':
      return axios.put(url, cloneData);
    case 'patch':
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};

const getResponeseErrMsg = (status) => {
  let msg = '未知错误';
  if (status > 199 && status < 300) {
    return '';
  }
  switch (status) {
    case 500:
      msg = '服务器发生未知错误.';
      break;
    case 403:
      msg = '访问服务器被拒绝';
      break;
    case 404:
      msg = '未找到请求的页面';
      break;
    case 405:
      msg = '不允许访问本页面的当前方法';
      break;
    case 408:
    case -1:
      msg = '访问超时';
      break;
    case 502:
      msg = '无法连接';
      break;
    case 504:
    case 0:
    case undefined:
      msg = '网络已断开,不能连接到服务器';
      break;
    default:
      msg = `系统错误,错误代码:${status}`;
  }
  return msg;
};

export default function request(options) {
  return fetch(options)
    .then((response) => {
      const { statusText, status } = response;
      let { data } = response;
      // eslint-disable-next-line no-unused-expressions
      if (options.fetchType === 'blob') {
        return Promise.resolve({
          success: true,
          message: statusText,
          statusCode: status,
          data: window.URL.createObjectURL(data),
        });
      }
      typeof (data) === 'string' && (data = doDecode(data));
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data,
      });
    })
    .catch((error) => {
      const { response = {} } = error;
      if (options.serverError === true) {
        return response;
      }
      // hashHistory.push(`/error`)
      let msg;
      const { statusText } = response;
      const statusCode = response.status;
      const errortext = getResponeseErrMsg(statusCode) || statusText;
      const { status, config: { url = '' } } = response;
      if (statusCode === 401) {
        notification.error({
          message: '未登录或登录已过期，请重新登录。',
        });
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        if (oauthLoginUrl) {
          window.location.replace(oauthLoginUrl);
        } else {
          return response;
        }
      }
      if (status === 403) {
        router.push('/oauthResult');
        return response;
      }
      if (response && response instanceof Object) {
        const { statusText } = response;
        msg = getResponeseErrMsg(statusCode) || statusText;
      }
      return Promise.reject({ success: false, statusCode, message: msg });
    });
}
