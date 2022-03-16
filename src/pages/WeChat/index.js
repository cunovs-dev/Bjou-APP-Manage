/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const namespace = 'wechat';

/* eslint react/no-multi-comp:0 */
@connect(({ wechat, loading }) => ({
  wechat,
  listLoading: loading.effects[`${namespace}/fetch`],
  unbinding: loading.effects[`${namespace}/unbind`],
}))

class WeChat extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '用户名称',
      dataIndex: 'bindUserName',
    },
    {
      title: '用户ID',
      dataIndex: 'bindUserId',
      render: val => {
        if (val && val !== '') {
          return val;
        }
        return '未填写';
      },
    },
    {
      title: '微信标识',
      dataIndex: 'wechatId',
    },
    {
      title: '解除绑定',
      render: (text, record) => {
        return (
          <Popconfirm
            title="确定要解除绑定吗?"
            onConfirm={() => this.confirm(record.bindId)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:;">解绑</a>
          </Popconfirm>
        );
      },

    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetch`,
    });
  }

  confirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/unbind`,
      payload: {
        bindId: id,
      },
    });
  };


  render() {
    const {
      [namespace]: { listData },
      listLoading,
    } = this.props;
    return (
      <PageHeaderWrapper title="微信绑定管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.bindId}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WeChat;
