/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Pagination,
  Card,
  Button,
  Tag,
  Divider,
  Table,
  Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'notification';

/* eslint react/no-multi-comp:0 */
@connect(({ notification, loading }) => ({
  notification,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class Notification extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '标题',
      dataIndex: 'noticeTitle',
    },
    {
      title: '内容',
      dataIndex: 'noticeContent',
    },
    {
      title: '发布时间',
      dataIndex: 'noticeCrateDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'publishState',
      render(text, record) {
        if (record.publishState === '0') {
          return <Tag color="red">未发布</Tag>;
        }
        if (record.publishState === '1') {
          return <Tag color="green">已发布</Tag>;
        }
        if (record.publishState === '2') {
          return <Tag color="gray">已归档</Tag>;
        }
        return '-';
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
                (values, callback) => this.handleUpdateClick(values, callback, record.noticeId)
              }
            >
              <a href="javascript:;">修改</a>
            </FormModal>
            <Divider type="vertical"/>
            {
              record.publishState === '0' || record.publishState === '2' ?
                <a
                  href="javascript:;"
                  onClick={() => this.handlerRelease(record.noticeId)}
                >
                  发布
                </a>
                :
                <Popconfirm
                  title="确定要归档吗?"
                  onConfirm={() => this.confirm(record.noticeId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:;">归档</a>
                </Popconfirm>
            }
          </>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        nowPage: 1,
        pageSize: 10,
      },
    });
  }

  confirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/closeing`,
      payload: {
        noticeId: id,
      },
    });
  };

  handleAddClick = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/addNoticeList`,
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
        noticeId: id,
      },
      callback,
    });
  };

  handlerRelease = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/release`,
      payload: {
        noticeId: id,
      },
    });
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      [namespace]: { pagination },
    } = this.props;
    dispatch({
      type: `${namespace}/updatePagination`,
      payload: {
        ...pagination,
        nowPage: page,
      },
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        nowPage: page,
        pageSize: pagination.pageSize,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch, [namespace]: { pagination } } = this.props;
    dispatch({
      type: `${namespace}/updatePagination`,
      payload: {
        ...pagination,
        pageSize,
      },
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        nowPage: current,
        pageSize,
      },
    });
  };

  render() {
    const {
      [namespace]: { listData, pagination },
      listLoading,
      adding,
    } = this.props;
    const { nowPage, pageSize, totalCount } = pagination;
    return (
      <PageHeaderWrapper title="通知公告">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <FormModal record={{}} loading={adding} onOk={this.handleAddClick}>
                <Button icon="plus" type="primary">
                  发布公告
                </Button>
              </FormModal>
            </div>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.noticeId}
              pagination={false}
            />
            <Pagination
              className="ant-table-pagination"
              total={parseInt(totalCount, 10)}
              current={parseInt(nowPage, 10)}
              pageSize={parseInt(pageSize, 10)}
              onChange={this.pageChangeHandler}
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Notification;
