import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Spin, Menu, Icon, Avatar } from 'antd';
import { oauthLoginUrl } from '../../utils/utils';
import HeaderDropdown from '../HeaderDropdown';


import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  render() {
    const {
      currentUser,
      onMenuClick,
      theme,
    } = this.props;
    /*    const menu = (
          <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="userinfo">
              <Icon type="setting" />
              <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="setting">
              <Icon type="lock" />
              修改密码
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">
              <Icon type="logout" />
              <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
            </Menu.Item>
          </Menu>
        );*/
    const getMenuItems = () => {
      let result = [], userId = localStorage.hasOwnProperty('userId') ? localStorage.getItem('userId') : -1;
      if (userId > -1 && userId < 100) {
        result.push(<Menu.Item key="userinfo">
          <Icon type="setting"/>
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings"/>
        </Menu.Item>);
        result.push(<Menu.Divider/>);
        result.push(<Menu.Item key="setting">
          <Icon type="lock"/>
          修改密码
        </Menu.Item>);
        result.push(<Menu.Divider/>);
        result.push(<Menu.Item key="logout">
          <Icon type="logout"/>
          <FormattedMessage id="menu.account.logout" defaultMessage="logout"/>
        </Menu.Item>);
      }
      return result;
    };
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {getMenuItems()}
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.userRealName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.photoPath}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.userRealName}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }}/>
        )}
      </div>
    );
  }
}
