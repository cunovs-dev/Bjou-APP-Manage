import requestaxios from '@/utils/requestAxios';

export async function queryDept(params) {
  return requestaxios({
    url: '/dept/findDept',
    data: params,
  });
}


export async function addDept(params) {
  return requestaxios({
    method: 'POST',
    url: '/dept/add',
    data: params,
  });
}

export async function upDateDept(params) {
  return requestaxios({
    method: 'POST',
    url: '/dept/update',
    data: params,
  });
}

export async function queryItemDept(params) {
  const { deptId = '' } = params;
  return requestaxios({
    url: `/dept/get/${deptId}`,
  });
}

export async function dvalidate(params) {
  const { deptId } = params;
  return requestaxios({
    url: `/dept/dvalidate/${deptId}`,
  });
}

export async function deleteDept(params) {
  return requestaxios({
    method: 'POST',
    url: '/dept/delete',
    data: params,
  });
}

export async function queryUser(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/deptUser',
    data: params,
  });
}

export async function queryItemUser(params) {
  return requestaxios({
    url: '/user/getUserById',
    data: params,
  });
}


export async function addUser(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/add',
    data: params,
  });
}

export async function upDateUser(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/update',
    data: params,
  });
}

export async function deleteUser(params) {
  return requestaxios({
    method: 'POST',
    url: '/user/delete',
    data: params,
  });
}
