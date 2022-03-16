import { message } from 'antd';
import * as Service from '../services';
import { upLoadFiles } from '@/services/api';

const defaultPagination = {
  totalCount: 0,
  nowPage: 1,
  pageSize: 10,
};
const getList = arr => {
  const result = [];
  if (!arr) {
    return undefined;
  }
  arr.map((item, i) => {
    result.push({
      ...item,
      key: i + 1,
    });
  });
  return result;
};
const namespace = 'organizational';
export default {
  namespace,
  state: {
    treeData: [],
    userData: [],
    itemDate: {},
    itemUser: {},
    children: [],
    pagination: defaultPagination,
    selectedKey: '',
    photoPath: null,
  },

  effects: {
    * fetchDept({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryDept, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            treeData: data,
          },
        });
      } else {
        message.error(msg || '查询失败');
      }
    },
    * fetchChildren({ payload, callback }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryDept, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            children: data,
          },
        });
        if (callback) callback(data);
      } else {
        message.error(msg || '查询失败');
      }
    },
    * addDept({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.addDept, payload);
      if (success) {
        yield put({ type: 'fetchDept' });
        message.success('创建成功');
        if (callback) callback();
      } else {
        message.error(msg || '创建失败');
      }
    },
    * upDateDept({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.upDateDept, payload);
      if (success) {
        yield put({ type: 'fetchDept' });
        message.success('修改成功');
        if (callback) callback();
      } else {
        message.error(msg || '修改失败');
      }
    },
    * dvalidate({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(Service.dvalidate, payload);
      if (success) {
        if (data.canDelete) {
          yield put({ type: 'deleteDept', payload });
        } else {
          message.error(data.msg, 3);
        }

      } else {
        message.error(msg || '删除失败');
      }
    },
    * deleteDept({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.deleteDept, payload);
      if (success) {
        yield put({ type: 'fetchDept' });
        message.success('删除成功');
        if (callback) callback();
      } else {
        message.error(msg || '删除失败');
      }
    },
    * queryItemDept({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(Service.queryItemDept, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            itemDate: data,
          },
        });
        if (callback) callback();
      } else {
        message.error(msg || '查询失败');
      }
    },
    * queryUser({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryUser, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            userData: getList(data.data),
            pagination: {
              totalCount: data.totalCount,
              nowPage: data.nowPage,
              pageSize: data.pageSize,
            },
          },
        });
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    * addUser({ payload, callback }, { call, put, select }) {
      const { selectedKey, pagination: { nowPage, pageSize } } = yield select(_ => _[namespace]);
      const { success, msg } = yield call(Service.addUser, payload);
      if (success) {
        yield put({ type: 'queryUser', payload: { nowPage, pageSize, deptId: selectedKey } });
        message.success('创建成功');
        if (callback) callback();
      } else {
        message.error(msg || '创建失败');
      }
    },
    * queryItemUser({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(Service.queryItemUser, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            itemUser: data,
          },
        });
        if (callback) callback();
      } else {
        message.error(msg || '查询失败');
      }
    },
    * upDateUser({ payload, callback }, { call, put, select }) {
      const { selectedKey, pagination: { nowPage, pageSize } } = yield select(_ => _[namespace]);
      const { success, msg } = yield call(Service.upDateUser, payload);
      if (success) {
        yield put({ type: 'queryUser', payload: { nowPage, pageSize, deptId: selectedKey } });
        message.success('修改成功');
        if (callback) callback();
      } else {
        message.error(msg || '修改失败');
      }
    },
    * deleteUser({ payload, callback }, { call, put, select }) {
      const { selectedKey, pagination: { nowPage, pageSize } } = yield select(_ => _[namespace]);
      const { success, msg } = yield call(Service.deleteUser, payload);
      if (success) {
        yield put({ type: 'queryUser', payload: { nowPage, pageSize, deptId: selectedKey } });
        message.success('删除成功');
        if (callback) callback();
      } else {
        message.error(msg || '删除失败');
      }
    },
    * uploadAvatar({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(upLoadFiles, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            photoPath: data,
          },
        });
      } else {
        message.error(msg || '修改失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    updatePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    clear(state) {
      return {
        ...state,
        userData: [],
      };
    },
  },
};
