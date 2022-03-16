import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';

import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import getPageTitle from '@/utils/getPageTitle';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright"/> 2019 北京开放大学移动端管理平台
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    /*const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });*/
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo}/>
              </div>
              <div className={styles.desc}>移动端管理平台</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright}/>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
