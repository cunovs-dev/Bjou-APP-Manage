import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    method: 'POST',
    url: '/service/findList',
    data: params,
  });
}

export async function add(params) {
  return requestaxios({
    method: 'POST',
    url: '/service/add',
    data: params,
  });
}

export async function update(params) {
  return requestaxios({
    method: 'POST',
    url: '/service/update',
    data: params,
  });
}

export async function deleteService(params) {
  const { serviceId = '' } = params;
  return requestaxios({
    method: 'POST',
    url: `/service/delete/${serviceId}`,
  });
}
