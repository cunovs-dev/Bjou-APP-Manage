import requestaxios from '@/utils/requestAxios';

export async function queryMenu(params) {
  return requestaxios({
    url: '/menu/getMenuTree',
    data: params,
  });
}


export async function addMenu(params) {
  return requestaxios({
    method: 'POST',
    url: '/menu/add',
    data: params,
  });
}

export async function upDateMenu(params) {
  return requestaxios({
    method: 'POST',
    url: '/menu/updateMenu',
    data: params,
  });
}

export async function queryItemMenu(params) {
  return requestaxios({
    url: `/menu/getMenuById`,
    data: params,
  });
}




