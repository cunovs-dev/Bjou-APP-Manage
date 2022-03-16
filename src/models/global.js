import { queryNotices, queryUserAuth, editorPass } from '@/services/api';
import { userAuthorityTag } from '@/utils/utils';
import { message } from 'antd';


export default {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    authorized: localStorage.hasOwnProperty(userAuthorityTag) ? { '/': localStorage.getItem(userAuthorityTag) === '1' } : {},
    pwdVisble: false,
  },

  effects: {
    * fetchUserAuth({ payload }, { select, call, put }) {
      const { authorized = {} } = yield select(state => state.global);
      const { authPath = '' } = payload;
      if (authPath && authPath != '/' && authorized.hasOwnProperty(authPath) && authorized[authPath]) {
        return;
      }
      const { responseData = {} } = yield call(queryUserAuth, payload);
      yield put({
        type: 'saveUserAuth',
        payload: { ...responseData },
      });
    },
    * editorPass({ payload: values }, { call, put }) {
      const data = yield call(editorPass, values);
      if (data.success) {
        message.success('修改成功');
        yield put({
          type: 'save',
          payload: {
            pwdVisble: false,
          },
        });
      } else {
        message.error(data.msg || '请稍后再试');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    saveUserAuth(state, { payload }) {
      const { authorized } = state;
      localStorage.setItem(userAuthorityTag, authorized['/'] === true ? '1' : '0');
      return {
        ...state,
        authorized: {
          ...authorized,
          ...payload,
        },
      };
    },
    clearUserAuth(state, { payload = {} }) {
      return {
        ...state,
        authorized: {
          ...payload,
        },
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      let lastPathname = '';
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        if ((!pathname.startsWith('/user/') || !pathname.startsWith('/oauthResult')) && (lastPathname === '' || lastPathname !== pathname)) {
          lastPathname = pathname;
          dispatch({
            type: 'fetchUserAuth',
            payload: {
              authPath: pathname,
            },
          });
        }
      });
    },
  },
};
