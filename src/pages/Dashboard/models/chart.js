import {
  queryLog,
  queryNotice,
  queryFeedback,
  queryService,
  queryChart,
  queryChartByTime,
  queryList,
  queryDownload,
  queryUse,
} from '../services';

export default {
  namespace: 'dashboard',

  state: {
    chartData: [],
    logData: {},
    noticeData: {},
    feedbackData: {},
    serviceData: {},
    listData: [],
    downloadData: [],
    useData: [],
    loading: false,
  },

  effects: {
    * fetch(_, { call, put }) {
      const [log, notice, feedback, service, list, download, use] = yield ([call(queryLog), call(queryNotice), call(queryFeedback), call(queryService), call(queryList), call(queryDownload), call(queryUse)]);
      if (log.success) {
        yield put({
          type: 'save',
          payload: {
            logData: log.data,
          },
        });
      }
      if (notice.success) {
        yield put({
          type: 'save',
          payload: {
            noticeData: notice.data,
          },
        });
      }
      if (feedback.success) {
        yield put({
          type: 'save',
          payload: {
            feedbackData: feedback.data,
          },
        });
      }
      if (service.success) {
        yield put({
          type: 'save',
          payload: {
            serviceData: service.data,
          },
        });
      }
      if (list.success) {
        yield put({
          type: 'save',
          payload: {
            listData: list.data.slice(0, 10),
          },
        });
      }
      if (download.success) {
        yield put({
          type: 'save',
          payload: {
            downloadData: download.data,
          },
        });
      }
      if (use.success) {
        yield put({
          type: 'save',
          payload: {
            useData: use.data,
          },
        });
      }
    },
    * fetchChart({ payload }, { call, put }) {
      const { success, data } = yield call(queryChart, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            chartData: data.chartData,
          },
        });
      }
    },
    * queryChartByTime({ payload }, { call, put }) {
      const { success, data, msg } = yield call(queryChartByTime, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            chartData: data.chartData,
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        salesData: [],
        logData: {},
        noticeData: {},
        feedbackData: {},
        serviceData: {},
      };
    },
  },
};
