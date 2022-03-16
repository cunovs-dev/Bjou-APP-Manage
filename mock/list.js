import { parse } from 'url';

const notificationList = () => {

  const list = [];
  for (let i = 0; i < 26; i += 1) {
    list.push({
      key: i + 1,
      title: `我是北京开放大学发布的第 ${i}个公告！`,
      desc: '这是一段描述',
      status: Math.floor(Math.random() * 10) % 3,
      createDate: new Date(`2019-06-${Math.floor(i / 2) + 1}`),
    });
  }
  return list;
};

function getNotificationList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const dataSource = notificationList();

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    data: dataSource,
    total: dataSource.length,
    pageSize,
    current: parseInt(params.currentPage, 10) || 1,
  };

  return res.json(result);
}


export default {
  'POST /api/getNoticeList': getNotificationList,
};
