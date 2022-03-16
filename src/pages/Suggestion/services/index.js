import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    url: '/feedback/findList',
    data: params,
  });
}

export async function reply(params) {
  return requestaxios({
    method: 'POST',
    url: '/feedback/reply',
    data: params,
  });
}

