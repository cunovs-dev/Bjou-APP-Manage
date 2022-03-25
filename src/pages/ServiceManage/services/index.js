import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    method: 'GET',
    url: '/app/course/findList',
    data: params,
  });
}

export async function add(params) {
  return requestaxios({
    method: 'POST',
    url: '/app/course/add',
    data: params,
  });
}

export async function update(params) {
  return requestaxios({
    method: 'POST',
    url: '/app/course/updatestate',
    data: params,
  });
}

export async function init(params) {
  return requestaxios({
    method: 'GET',
    url: `/app/course/getInitUrl`,
    data: params,
  });
}

export async function initialize(params) {
  return requestaxios({
    method: 'GET',
    url: `${params}`,
    hasUrl: true,
  });
}

export async function batchAdd(params) {
  return requestaxios({
    method: 'POST',
    url: '/app/course/batchadd',
    data: params,
  });
}
