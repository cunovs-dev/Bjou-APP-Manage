import requestaxios from '@/utils/requestAxios';

export async function queryNoticeList(params) {
  return requestaxios({
    url: '/notice/findList',
    data: params,
  });
}

export async function addNoticeList(params) {
  return requestaxios({
    method: 'POST',
    url: '/notice/submitNotic',
    data: params,
  });
}

export async function updateNoticeList(params) {
  return requestaxios({
    method: 'post',
    url: '/notice/update',
    data: params,
  });
}

export async function closedNoticeList(params) {
  return requestaxios({
    method: 'post',
    url: '/notice/archive',
    data: params,
  });
}

export async function release(params) {
  return requestaxios({
    method: 'post',
    url: '/notice/release',
    data: params,
  });
}
