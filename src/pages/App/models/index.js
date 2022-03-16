import { message } from 'antd';
import * as Service from '../services';
import { upLoadFiles } from '@/services/api';

const namespace = 'app';
export default {
  namespace,
  state: {
    icons: [],
  },

  effects: {

    * uploadFiles({ payload, callback }, { call, put }) {
      const { success, msg, data } = yield call(upLoadFiles, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            photoPath: data,
          },
        });
        if (callback) callback();
        yield put({
          type: 'featchIcons',
        });
      } else {
        message.error(msg || '修改失败');
      }
    },
    * featchIcons({callback}, { call, put }) {
      const { success, msg, data } = yield call(Service.featchIcons);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            icons: data,
          },
        });
        if(callback) callback(data)
      } else {
        message.error(msg || '获取图标失败');
      }
    },
    * saveIcons({ payload }, { call }) {
      const { success, msg } = yield call(Service.saveIcons, payload);
      if (success) {
        message.success(msg || '修改成功');
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
