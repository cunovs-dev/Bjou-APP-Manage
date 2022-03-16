import { query as queryUsers, queryCurrent, settings } from '@/services/user';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { upLoadFiles } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    photoPath: null,
  },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const userId = localStorage.getItem('userId');
      const { success, data, msg = '查询个人信息出错' } = yield call(queryCurrent, { userId });
      if (success) {
        yield put({
          type: 'saveCurrentUser',
          payload: data,
        });
      } else {
        message.error(msg);
      }
    },
    * settings({ payload }, { call, put }) {
      const userId = localStorage.getItem('userId');
      const { success, data, msg = '请稍后再试' } = yield call(settings, { userId, ...payload });
      if (success) {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            data,
          },
        });
        message.success('修改成功');
        yield put({
          type: 'fetchCurrent',
        });
        yield put(routerRedux.goBack());

      } else {
        message.error(msg);
      }
    },

    * uploadAvatar({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(upLoadFiles, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            photoPath: data,
          },
        });
      } else {
        message.error(msg || '修改失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
