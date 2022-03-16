import { message } from 'antd';
import * as Service from '../services';

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
const namespace = 'edition';
export default {
  namespace,
  state: {
    listData: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryList, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            listData: getList(data),
          },
        });
      } else {
        message.error(msg || '查询失败');
      }
    },
    * add({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.add, payload);
      if (success) {
        message.success('发布成功');
        if (callback) callback();
        yield put({ type: 'fetch'});
      } else {
        message.error(msg || '发布失败');
      }
    },
    * update({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.update, payload);
      if (success) {
        message.success('修改成功');
        if (callback) callback();
        yield put({ type: 'fetch'});
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
