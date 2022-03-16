export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: '404',
      },
    ],
  },
  {
    icon: 'warning',
    path: '/oauthResult',
    routes: [
      // exception
      {
        path: '/oauthResult',
        name: 'not-permission',
        component: './Exception/OauthResult',
      },
    ],
  },
  // app
  /*
  * 1、此处设置所有路由，
  * 2、通过menu获取用户菜单，
  * 3、通过在'/'上设置Routes调用后台判断用户是否有访问路由的权限。
  * */
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/CnvAuthorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },
      //日志管理
      {
        path: '/log',
        routes: [
          {
            path: '/log/basic',
            component: './Log',
          },
        ],
      },
      //组织机构管理
      {
        path: '/organizational',
        routes: [
          {
            path: '/organizational/basic',
            component: './Organizational/Organizational',
          },
        ],
      },
      // 服务状态
      {
        path: '/service',
        routes: [
          {
            path: '/service/basic',
            component: './Service',
          },
        ],
      },
      // 通知公告
      {
        path: '/notification',
        routes: [
          {
            path: '/notification/basic',
            component: './Notification',
          },
        ],
      },
      // 意见反馈
      {
        path: '/suggestion',
        routes: [
          {
            path: '/suggestion/basic',
            component: './Suggestion',
          },
        ],
      },
      {
        path: '/lessons',
        routes: [
          {
            path: '/lessons/basic',
            component: './Lessons',
          },
        ],
      },
      // 个人设置
      {
        path: '/settings',
        routes: [
          {
            path: '/settings/basic',
            component: './Settings',
          },
        ],
      },
      {
        path: '/edition',
        routes: [
          {
            path: '/edition/basic',
            component: './Edition',
          },
        ],
      },
      {
        path: '/menu',
        routes: [
          {
            path: '/menu/basic',
            component: './Menu',
          },
        ],
      },
      //微信绑定
      {
        path: '/wechat',
        routes: [
          {
            path: '/wechat/basic',
            component: './WeChat',
          },
        ],
      },
      //任务管理
      {
        path: '/task',
        routes: [
          {
            path: '/task/basic',
            component: './Task',
          },
        ],
      },
      //权限管理
      {
        path: '/authority',
        routes: [
          {
            path: '/authority/basic',
            component: './Authority',
          },
        ],
      },
      //app管理
      {
        path: '/app',
        routes: [
          {
            path: '/app/basic',
            component: './App',
          },
        ],
      },
      //接口管理
      {
        path: '/apimanagement',
        routes: [
          {
            path: '/apimanagement/basic',
            component: './ApiManagement',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
