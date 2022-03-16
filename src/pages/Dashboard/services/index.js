import requestaxios from '@/utils/requestAxios';

export async function queryLog(params) {
  return requestaxios({
    url: '/log/statistics',
    data: params,
  });
}

export async function queryNotice(params) {
  return requestaxios({
    url: '/notice/statistics',
    data: params,
  });
}

export async function queryFeedback(params) {
  return requestaxios({
    url: '/feedback/statistics',
    data: params,
  });
}

export async function queryService(params) {
  return requestaxios({
    url: '/service/statistics',
    data: params,
  });
}

export async function queryChart(params) {
  return requestaxios({
    url: `/appLog/chart/${params}`,
  });
}

export async function queryChartByTime(params) {
  return requestaxios({
    url: '/appLog/chart/custom',
    data: params,
  });
}


export async function queryList(params) {
  return requestaxios({
    url: '/appLog/service',
    data: params,
  });
}

export async function queryDownload(params) {
  return requestaxios({
    url: '/config/downloadStatistics',
    data: params,
  });
}

export async function queryUse(params) {
  return requestaxios({
    url: '/appLog/chart/userStatistics',
    data: params,
  });
}
