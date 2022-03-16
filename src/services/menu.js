
import requestaxios from '@/utils/requestAxios';

export async function queryMenus(params) {
  return requestaxios({
    url: '/menu/getUserMenu',
    data: params,
  });
}
