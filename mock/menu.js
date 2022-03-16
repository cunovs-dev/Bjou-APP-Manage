import mockjs from 'mockjs';

const getMenus = [
  {
    path: '/dashboard',
    name: '首页',
    icon: '../../../public/dashboard.svg',
    children: [
      {
        path: '/dashboard/analysis',
        name: '后台分析',
      },

    ],
  },
  {
    path: '/log',
    name: '系统日志',
    icon: 'dashboard',
    children: [
      {
        path: '/log/basic',
        name: '日志管理',
      },

    ],
  },
  {
    path: '/organizational',
    name: '用户',
    icon: 'dashboard',
    children: [
      {
        path: '/organizational/basic',
        name: '组织机构管理',
      },
    ],
  },
  {
    path: '/service',
    name: '服务状态',
    icon: 'dashboard',
    children: [
      {
        path: '/service/basic',
        name: '服务状态管理',
      },

    ],
  },
  {
    path: '/notification',
    name: '通知公告',
    icon: 'dashboard',
    children: [
      {
        path: '/notification/basic',
        name: '通知公告管理',
      },

    ],
  },
  {
    path: '/suggestion',
    name: '意见建议',
    icon: 'dashboard',
    children: [
      {
        path: '/suggestion/basic',
        name: '意见建议管理',
      },

    ],
  },
  {
    path: '/edition',
    name: '版本管理',
    icon: 'dashboard',
    children: [
      {
        path: '/edition/basic',
        name: 'APP版本管理',
      },
    ],
  },
  {
    path: '/menu',
    name: '菜单',
    icon: 'dashboard',
    children: [
      {
        path: '/menu/basic',
        name: '菜单管理',
      },
    ],
  },
];


export default {
  'GET /api/project/menus': getMenus,
};
