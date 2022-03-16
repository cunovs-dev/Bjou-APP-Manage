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
const namespace = 'wechat';
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
    * unbind({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.unbind, payload);
      if (success) {
        message.success('解绑成功');
        if (callback) callback();
        yield put({ type: 'fetch'});
      } else {
        message.error(msg || '解绑失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
