import { message } from 'antd';
import * as Service from '../services';

const namespace = 'menuManage';
export default {
  namespace,
  state: {
    menuData: [],
    itemDate: {},
    children: [],
    selectedKey: '',
  },

  effects: {
    * fetchMenu({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryMenu, payload);
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
      const { success, data, msg } = yield call(Service.queryMenu, payload);
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
    * addMenu({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.addMenu, payload);
      if (success) {
        yield put({ type: 'fetchMenu' });
        message.success('创建成功');
        if (callback) callback();
      } else {
        message.error(msg || '创建失败');
      }
    },
    * upDateMenu({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.upDateMenu, payload);
      if (success) {
        yield put({ type: 'fetchDept' });
        message.success('修改成功');
        if (callback) callback();
      } else {
        message.error(msg || '修改失败');
      }
    },
    * queryItemMenu({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(Service.queryItemMenu, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            itemDate: data,
          },
        });
        if (callback) callback();
      } else {
        message.error(msg || '修改失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
