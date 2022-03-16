import { message } from 'antd';
import * as Service from '../services';

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
const namespace = 'authority';
export default {
  namespace,
  state: {
    menuData: [],
    treeData: [],
    userData: [],
    itemDate: {},
    children: [],
    pagination: defaultPagination,
    selectedKey: '',
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
    * fetchMenu(_, { call, put }) {
      const { success, data, msg } = yield call(Service.queryMenu);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            menuData: data,
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
    * queryUser({ payload, callback }, { call, put }) {
      console.log(callback)
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
        if(callback) callback(getList(data.data))
      } else {
        message.error(msg || '请稍后再试');
      }
    },
    * saveAuthority({ payload }, { call, put }) {
      const { success, msg } = yield call(Service.saveAuthority, payload);
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg || '请稍后再试');
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
  },
};
