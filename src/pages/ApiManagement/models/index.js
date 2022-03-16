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
const namespace = 'apimanagement';
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
        message.success('添加成功');
        if (callback) callback();
        yield put({ type: 'fetch' });
      } else {
        message.error(msg || '添加失败');
      }
    },
    * update({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.update, payload);
      if (success) {
        message.success('修改成功');
        if (callback) callback();
        yield put({ type: 'fetch' });
      } else {
        message.error(msg || '修改失败');
      }
    },
    * start({ payload, callback }, { call, put }) {
      const { success, message: msg } = yield call(Service.start, payload);
      if (success) {
        message.success('已启动');
        if (callback) callback();
        yield put({
          type: 'update',
          payload: {
            status: 1,
            ...payload,
          },
        });
      } else {
        message.error(msg || '操作失败');
      }
    },
    * stop({ payload, callback }, { call, put }) {
      const { success, message: msg } = yield call(Service.stop, payload);
      if (success) {
        message.success('已停止');
        if (callback) callback();
        yield put({
          type: 'update',
          payload: {
            status: 0,
            ...payload,
          },
        });
      } else {
        message.error(msg || '操作失败');
      }
    },
    * deleteContainer({ payload, callback }, { call, put }) {
      const { success, msg } = yield call(Service.deleteContainer, payload);
      if (success) {
        message.success('删除成功');
        if (callback) callback();
        yield put({ type: 'fetch' });
      } else {
        message.error(msg || '删除失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

  },
};
