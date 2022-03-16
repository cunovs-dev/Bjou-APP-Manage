import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    url: '/version/list',
    data: params,
  });
}

export async function add(params) {
  return requestaxios({
    method: 'POST',
    url: '/version/publish',
    data: params,
  });
}

export async function update(params) {
  return requestaxios({
    method: 'post',
    url: '/version/update',
    data: params,
  });
}

