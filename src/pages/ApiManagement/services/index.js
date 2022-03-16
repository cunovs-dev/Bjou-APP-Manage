import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    url: '/containers/list',
    data: params,
  });
}

export async function add(params) {
  return requestaxios({
    method: 'POST',
    url: '/containers/add',
    data: params,
  });
}

export async function update(params) {
  return requestaxios({
    method: 'POST',
    url: '/containers/update',
    data: params,
  });
}

export async function start(params) {
  return requestaxios({
    method: 'post',
    url: '/containerInterface/run',
    data: params,
  });
}

export async function stop(params) {
  return requestaxios({
    method: 'post',
    url: '/containerInterface/stop',
    data: params,
  });
}


export async function deleteContainer(params) {
  return requestaxios({
    method: 'post',
    url: '/containers/delete',
    data: params,
  });
}
