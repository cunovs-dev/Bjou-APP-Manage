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
const namespace = 'service';
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
        message.success('创建成功');
        if (callback) callback();
        yield put({ type: 'fetch'});
      } else {
        message.error(msg || '创建失败');
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
    * deleteService({ payload }, { call, put }) {
      const { success, msg } = yield call(Service.deleteService, payload);
      if (success) {
        message.success('删除成功');
        yield put({ type: 'fetch'});
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
