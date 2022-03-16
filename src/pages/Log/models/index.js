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
const namespace = 'log';
export default {
  namespace,
  state: {
    listData: [],
    pagination: defaultPagination,
    logType: '',
  },

  effects: {
    * fetch({ payload }, { call, put, select }) {
      const { logType } = yield select(_ => _[namespace]);
      const { success, data, msg } = yield call(Service.queryList, { ...payload, logType: logType === '' ? undefined : logType});
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
