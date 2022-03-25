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
const namespace = 'lessons';
export default {
  namespace,
  state: {
    listData: [],
    pagination: defaultPagination,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const { success, data, msg } = yield call(Service.queryList, payload);
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
    * add({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.add, payload);
      if (success) {
        message.success('添加成功');
        if (callback) callback();
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '添加失败');
      }
    },
    * batchAdd({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg } = yield call(Service.batchAdd, payload);
      if (success) {
        message.success('批量添加成功');
        if (callback) callback();
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });
      } else {
        message.error(msg || '批量添加失败');
      }
    },
    * update({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { courseState } = payload;
      const { success, msg } = yield call(Service.update, payload);
      if (success) {
        yield put({ type: 'fetch', payload: { nowPage, pageSize } });

        if (courseState === '1') {
          message.success('发布成功');
        } else {
          message.success('撤回成功');
          if (callback) callback();
        }

      } else {
        message.error(msg || '修改失败');
      }
    },
    * init({ payload, callback }, { call, put, select }) {
      const { pagination: { nowPage, pageSize } } = yield select(_ => _[`${namespace}`]);
      const { success, msg, data } = yield call(Service.init, payload);
      if (success) {

        yield put({ type: 'fetch' , payload: { nowPage, pageSize } });
        message.success('已开始初始化,请耐心等待...', 3);
        //yield put({ type: 'initialize', payload: data });
      } else {
        message.error(msg || '初始化失败');
      }
      if (callback) callback();
    },
    * initialize({ payload }, { call }) {
      yield call(Service.initialize, payload);
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
