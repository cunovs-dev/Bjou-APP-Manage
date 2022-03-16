import request from '@/utils/request';
import requestaxios from '@/utils/requestAxios';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return requestaxios({
    url: '/user/getUserById',
    data: params,
  });
}

export async function settings(params) {
  return requestaxios({
    url: '/user/update',
    method: 'post',
    data: params,
  });
}
