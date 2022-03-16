import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    method: 'get',
    url: '/task/list',
    data: params,
  });
}

export async function add(params) {
  return requestaxios({
    method: 'POST',
    url: '/task/add',
    data: params,
  });
}

export async function update(params) {
  return requestaxios({
    method: 'POST',
    url: '/task/update',
    data: params,
  });
}

export async function deleteTask(params) {
  return requestaxios({
    method: 'POST',
    url: '/task/delete',
    data: params,
  });
}
