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
const namespace = 'notification';
export default {
  namespace,
  state: {
    listData: [],
    pagination: defaultPagination,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryNoticeList, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            listData: getList(data.data),
            pagination: {
              totalCount: data.totalCount,
              nowPage: data.nowPage,
              pageSize: data.pageSize,
            },
          },
        });
      } else {
        message.error(msg || '查询失败');
      }
    },
    * addNoticeList({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.addNoticeList, payload);
      if (success) {
        message.success('发布成功');
        if (callback) callback();
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '发布失败');
      }
    },
    * update({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.updateNoticeList, payload);
      if (success) {
        message.success('修改成功');
        if (callback) callback();
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '修改失败');
      }
    },
    * closeing({ payload }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.closedNoticeList, payload);
      if (success) {
        message.success('已归档');
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '归档失败');
      }
    },
    * release({ payload }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.release, payload);
      if (success) {
        message.success('已发布');
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '发布失败');
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
