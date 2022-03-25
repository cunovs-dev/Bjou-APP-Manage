import requestaxios from '@/utils/requestAxios';


export async function getState(params) {
  return requestaxios({
    method: 'GET',
    url: '/config/showSS',
    data: params,
    isForeUrl: true,
  });
}

export async function changeState(params) {
  return requestaxios({
    method: 'GET',
    url: '/config/setSS',
    data: params,
    isForeUrl: true,
  });
}

export async function initialize(params) {
  return requestaxios({
    method: 'GET',
    url: '/config/init',
    data: {
      code: 'Innovation_2019_bkapp',
      ...params,
    },
    isForeUrl: true,
  });
}

export async function getInfo(params) {
  return requestaxios({
    method: 'GET',
    url: '/log/info/all',
    data: params,
  });
}

export async function setInfo(params) {
  const { code } = params;
  return requestaxios({
    method: 'POST',
    url: `/log/info/set/${code}`,
    data: params,
  });
}
