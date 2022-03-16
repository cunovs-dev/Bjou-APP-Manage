import requestaxios from '@/utils/requestAxios';

export async function queryDept(params) {
  return requestaxios({
    url: '/dept/findDept',
    data: params,
  });
}

export async function queryItemDept(params) {
  const { deptId = '' } = params;
  return requestaxios({
    url: `/dept/get/${deptId}`,
  });
}

export async function queryUser(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/deptUserAndMenu',
    data: params,
  });
}

export async function queryMenu() {
  return requestaxios({
    url: '/menu/getMenuTree',
  });
}

export async function saveAuthority(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/updateUserMenus',
    data: params,
  });
}

