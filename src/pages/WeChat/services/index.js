import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    url: '/app/bind/list',
    data: params,
  });
}

export async function unbind(params) {
  return requestaxios({
    method: 'POST',
    url: '/app/bind/unbind',
    data: params,
  });
}

