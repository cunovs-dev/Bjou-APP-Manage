/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Button,
  Table,
  Icon,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'edition';

/* eslint react/no-multi-comp:0 */
@connect(({ edition, loading }) => ({
  edition,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class Edition extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '类型',
      dataIndex: 'appVersionType',
      render: val => {
        if (val === 'Android') {
          return <Icon type="android" theme="filled" style={{ color: '#1890ff', fontSize: '18px' }}/>;
        }
        if (val === 'IOS') {
          return <Icon type="apple" theme="filled" style={{ color: '#1890ff', fontSize: '18px' }}/>;
        }
        return '-';
      },
    },
    {
      title: '版本号',
      dataIndex: 'appVersion',
    },
    {
      title: '版本信息',
      dataIndex: 'appUpdateInfo',
    },
    {
      title: '发布时间',
      dataIndex: 'appPublishDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        const { adding } = this.props;
        return (
          <>
            <FormModal
              record={record}
              loading={adding}
              onOk={
                (values, callback) => this.handleUpdateClick(values, callback)
              }
            >
              <a href="javascript:;">修改</a>
            </FormModal>
          </>
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

  handleAddClick = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/add`,
      payload: values,
      callback,
    });
  };

  handleUpdateClick = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: values,
      callback,
    });
  };

  render() {
    const {
      [namespace]: { listData },
      listLoading,
      adding,
    } = this.props;
    return (
      <PageHeaderWrapper title="APP版本管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <FormModal record={{}} loading={adding} onOk={this.handleAddClick}>
                <Button icon="plus" type="primary">
                  发布新版本
                </Button>
              </FormModal>
            </div>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.appVersion}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Edition;
