import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { notification } from 'antd';
import { fakeAccountLogin, fakeAccountLogout, queryVerify } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, setUserId, clearUserId, userAuthorityTag } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { oauthLoginUrl } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    captchaImageData: '',
  },

  effects: {
    * login({ payload }, { call, put }) {
      const data = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (data.success === true) {
        localStorage.setItem(userAuthorityTag, '1');
        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });
        //登录成功，自动加入根目录的访问权限。
        yield put({
          type: 'global/saveUserAuth',
          payload: {
            '/': true,
          },
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        if (redirect)
          yield put({
            type: 'global/fetchUserAuth',
            payload: {
              authPath: redirect,
            },
          });
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        if (data.captchaImageData) {
          yield put({
            type: 'queryVerify',
          });
        }
        notification.error({
          message: data.message,
        });
      }
    },
    * queryVerify({ payload }, { call, put }) {
      const data = yield call(queryVerify, payload);
      if (data.success) {
        yield put({
          type: 'save',
          payload: {
            captchaImageData: data.data,
          },
        });
      } else {
        notification.error({
          message: data.message || '图片验证码获取失败',
        });
      }
    },
    * logout(_, { call, put }) {
      yield call(fakeAccountLogout);
      //注销时，清除用户权限
      yield localStorage.removeItem(userAuthorityTag);
      yield put({
        type: 'global/clearUserAuth',
        payload: {
          '/': true,
        },
      });
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      clearUserId();
      reloadAuthorized();
      if (oauthLoginUrl) {
        window.location.replace(oauthLoginUrl);
      } else if (window.location.pathname !== '/user/login') {
        // redirect
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setUserId(payload);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user/login') {
          // dispatch({
          //   type: 'queryVerify',
          // });
        }
      });
    },
  },
};
