/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Tag,
  Button,
  Divider,
  Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'service';

/* eslint react/no-multi-comp:0 */
@connect(({ service, loading }) => ({
  service,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class Service extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '名称',
      dataIndex: 'serviceName',
    },
    {
      title: '地址',
      dataIndex: 'serviceUri',
    },
    {
      title: '状态',
      dataIndex: 'serviceState',
      render(text) {
        return <Tag color={text === '运行中' ? 'green' : 'red'}>{text}</Tag>;
      },
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
                (values, callback) => this.handleUpdateClick(values, callback, record.serviceId)
              }
            >
              <a href="javascript:void(0);">修改</a>
            </FormModal>
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.confirm(record.serviceId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
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

  handleUpdateClick = (values, callback, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        ...values,
        serviceId: id,
      },
      callback,
    });
  };

  confirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteService`,
      payload: {
        serviceId: id,
      },
    });
  };


  render() {
    const {
      [namespace]: { listData },
      listLoading,
      adding,
    } = this.props;
    return (
      <PageHeaderWrapper title="服务状态">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <FormModal record={{}} loading={adding} onOk={this.handleAddClick}>
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </FormModal>
            </div>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.serviceId}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Service;
