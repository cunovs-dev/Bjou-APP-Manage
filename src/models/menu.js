import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import Authorized from '@/utils/Authorized';
import { queryMenus } from '@/services/menu';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.menuName || !item.menuEntrance) {
        return null;
      }
      const result = {
        name: item.menuName,
        path: item.menuEntrance,
        icon: item.menuIcon,
      };
      if (item.children) {
        const children = formatter(item.children);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  const auths = localStorage.getItem('antd-pro-authority');
  return menuData
    .filter(item => item.name && !item.hideInMenu && (auths && auths === '["user"]' ? !item.path.includes('monitor') : true))
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData(_, { call, put }) {
      const response = yield call(queryMenus);
        const originalMenuData = memoizeOneFormatter(response.data);
        const menuData = originalMenuData;
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
        yield put({
          type: 'save',
          payload: { menuData, breadcrumbNameMap },
        });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
