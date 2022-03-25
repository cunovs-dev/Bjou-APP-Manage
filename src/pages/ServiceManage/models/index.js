import { message } from 'antd';
import * as Service from '../services';

const namespace = 'serviceManage';
export default {
  namespace,
  state: {
    l: false,
    f: false,
    r: false,
    alertInfo: {},
  },

  effects: {
    * changeState({ payload, callback }, { call }) {
      const { success, msg } = yield call(Service.changeState, payload);
      if (success && callback) {
        callback(/yes/.test(msg));
      } else {
        message.error('查询失败');
      }
    },
    * getState({ payload, callback }, { call, put }) {
      const { success, r, l, f, msg } = yield call(Service.getState, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            l,
            f,
            r,
          },
        });
      } else {
        message.error(msg || '未知错误');
      }
    },
    * initialize({ payload, callback }, { call }) {
      const { success, message: msg } = yield call(Service.initialize, payload);

      if (success) {
        message.destroy();
        message.success('初始化成功', 2.5);
        if (callback) callback();
      } else {
        message.destroy();
        message.error(msg || '未知错误');
      }
    },
    * getInfo({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.getInfo, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            alertInfo: data,
          },
        });
      } else {
        message.error(msg || '未知错误');
      }
    },
    * setInfo({ payload, callback }, { call, put }) {
      const { success, data, msg } = yield call(Service.setInfo, payload);
      if (success) {
        if (callback) callback();
        yield put({
          type: 'getInfo',
        });
        message.success(data);
      } else {
        message.error(msg || '未知错误');
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
