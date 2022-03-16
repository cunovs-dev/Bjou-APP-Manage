/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Pagination,
  Card,
  Table,
  Tag,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'suggestion';

/* eslint react/no-multi-comp:0 */
@connect(({ suggestion, loading }) => ({
  suggestion,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class Suggestion extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '提交人',
      dataIndex: 'submitUserName',
    },
    {
      title: '提交人电话',
      dataIndex: 'submitUserPhone',
      render: val => {
        if (val && val !== '') {
          return val;
        }
        return '未填写';
      },
    },
    {
      title: '类型',
      dataIndex: 'submitType',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '资源名称',
      dataIndex: 'resourcesName',
    },
    {
      title: '建议',
      dataIndex: 'submitContent',
      width: 600,
    },
    {
      title: '图片',
      dataIndex: 'submitAnnex',
      render: (text, record) => (
        record.submitAnnex ?
          <div style={{ display: 'flex' }}>
            {
              record.submitAnnex.split(',').map(item =>
                <a key={item} href={`${record.baseHost}${item}`} rel="noopener noreferrer" target="_blank">
                  <img
                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    src={`${record.baseHost}${item}`}
                    alt=""
                  />
                </a>,
              )
            }
          </div>
          :
          '未上传'
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'submitDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'currentStatus',
      render(text) {
        if (text === '0') {
          return <Tag color="red">未回复</Tag>;
        }
        if (text === '1') {
          return <Tag color="green">已回复</Tag>;
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
                (values, callback) => this.handleReplyClick(values, callback, record.opinionId)
              }
            >
              <a href="javascript:void(0);">
                {
                  record.currentStatus === '1' ?
                    '修改'
                    :
                    '回复'
                }
              </a>
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
      payload: {
        nowPage: 1,
        pageSize: 10,
      },
    });
  }

  handleReplyClick = (values, callback, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/reply`,
      payload: {
        ...values,
        opinionId: id,
      },
      callback,
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
    } = this.props;
    const { nowPage, pageSize, totalCount } = pagination;
    return (
      <PageHeaderWrapper title="意见建议">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.opinionId}
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

export default Suggestion;
