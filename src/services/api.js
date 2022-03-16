import { stringify } from 'qs';
import request from '@/utils/request';
import requestaxios from '@/utils/requestAxios';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fakeAccountLogin(params) {
  return requestaxios({
    url: '/login/account',
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogout() {
  return requestaxios({
    url: '/login/logout',
    method: 'GET',
  });
}


export async function queryUserAuth(params = {}) {
  return requestaxios({
    url: '/demo/valid',
    method: 'GET',
    data: params,
  });
}

export async function upLoadFiles(params) {
  return requestaxios({
    url: '/file/upload',
    method: 'post',
    data: params,
  });
}

export async function editorPass(params) {
  return requestaxios({
    url: '/user/updatepwd',
    method: 'post',
    data: params,
  });
}

export async function queryVerify(params) {
  return requestaxios({
    url: '/code/verify',
    data: params,
    fetchType:'blob'
  });
}
