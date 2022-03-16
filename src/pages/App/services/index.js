import requestaxios from '@/utils/requestAxios';

export async function featchIcons(params) {
  return requestaxios({
    url: '/app/menuicon/list',
    data: params,
  });
}

export async function saveIcons(params) {
  return requestaxios({
    url: '/app/menuicon/update',
    method: 'POST',
    data: params,
  });
}
