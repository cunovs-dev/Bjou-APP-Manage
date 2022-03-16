/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Pagination,
  Card,
  Table,
  Tooltip,
} from 'antd';
import SearchForm from './components/SearchForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '@/global.less';

const namespace = 'log';
const style = {
  maxWidth: '30Vh',
};
const logTypes = {
  10: '运行日志',
  20: '任务日志',
  30: '调试日志',
  40: '系统错误日志',
  50: '后台访问日志',
  60: '后台操作日志',
};

/* eslint react/no-multi-comp:0 */
@connect(({ log, loading }) => ({
  log,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class Log extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '日志类型',
      dataIndex: 'logType',
      render: (val) => (logTypes[parseInt(val, 10)]),

    },
    {
      title: '操作用户',
      dataIndex: 'logInfo',
      key: 'user',
      render: (val) => (JSON.parse(val).userRealName),

    },
    {
      title: '信息',
      dataIndex: 'logInfo',
      render: (val) => <Tooltip placement='top' overlayStyle={style} title={val}>
        <span className={styles.info}>{JSON.parse(val).operation || JSON.parse(val).url}</span>
      </Tooltip>,

    },
    {
      title: '时间',
      dataIndex: 'logDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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

  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/save`,
      payload: {
        logType: '',
      },
    });
  }

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

  hanlerReset = () => {
    const {
      dispatch,
      [namespace]: { pagination: { pageSize } },
    } = this.props;
    dispatch({
      type: `${namespace}/save`,
      payload: {
        logType: '',
      },
    });
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        nowPage: 1,
        pageSize,
      },
    });
  };

  handlerSearch = values => {
    const {
      dispatch,
      [namespace]: { pagination: { pageSize } },
    } = this.props;
    const { logType = '' } = values;
    dispatch({
      type: `${namespace}/save`,
      payload: {
        logType,
      },
    });
    const res = {
      logType: logType === '' ? undefined : logType,
      nowPage: 1,
      pageSize,
    };
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        ...res,
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
      <PageHeaderWrapper title="日志管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableForm}>
              <SearchForm onOk={this.handlerSearch} onReset={this.hanlerReset}/>
            </div>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.logId}
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

export default Log;
