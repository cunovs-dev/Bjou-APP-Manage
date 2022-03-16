import requestaxios from '@/utils/requestAxios';

export async function queryList(params) {
  return requestaxios({
    method: 'POST',
    url: '/log/syslog',
    data: params,
  });
}


