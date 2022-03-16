/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Button,
  Divider,
  Popconfirm,
  Pagination,
  Modal,
  Switch,
  Alert,
} from 'antd';
import classNames from 'classnames';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import AddModal from './components/addModal';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'lessons';
const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({ lessons, loading }) => ({
  lessons,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.effects[`${namespace}/add`],
  initLoading: loading.effects[`${namespace}/init`],
  updateLoading: loading.effects[`${namespace}/update`],
  batchAddLoading: loading.effects[`${namespace}/batchAdd`],
}))

class Lessons extends PureComponent {
  state = {
    showWarning: false,
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: 'ID',
      dataIndex: 'courseId',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '添加时间',
      dataIndex: 'createDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'courseState',
      render: (text, record) => {
        return (
          <Popconfirm
            title={`确定${parseInt(text, 10) ? '撤回' : '发布'}要吗?`}
            onConfirm={() => this.changeState(record)}
            okText="确定"
            cancelText="取消"
          >
            <Switch
              checkedChildren="撤回"
              unCheckedChildren="未发布"
              checked={Boolean(parseInt(text, 10))}
            />
          </Popconfirm>
        );
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
                (values, callback) => this.handleUpdateClick(values, callback, record.courseId)
              }
            >
              <a href="javascript:void(0);">修改</a>
            </FormModal>
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要初始化吗?"
              onConfirm={() => this.initConfirm(record.courseId)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:;">初始化</a>
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
      payload: {
        nowPage: 1,
        pageSize: 10,
      },
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

  handleBatchAddClick = (values, callback) => {
    const { dispatch } = this.props;
    const { lessons = '', init = true } = values;
    dispatch({
      type: `${namespace}/batchAdd`,
      payload: {
        addParam: lessons,
        init,
      },
      callback,
    });
  };

  handleUpdateClick = (values, callback, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        ...values,
        courseId: id,
      },
      callback,
    });
  };

  initConfirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/init`,
      payload: {
        courseId: id,
      },
      callback: this.hideWarning,
    });
  };


  extraBox = () => {
    const { showWarning } = this.state;
    return (
      <div className={classNames({ [styles.active]: showWarning })}>
        <Button
          icon="exclamation-circle"
          type="primary"
          onClick={this.showInitConfirm}
        >
          初始化
        </Button>
      </div>
    );
  };


  showInitConfirm = () => {
    confirm({
      title: '确定要初始化课程信息?',
      content: <Alert
        message="警告"
        type="warning"
        description='课程初始化需要一定的时间，这段时间内会影响用户访问APP数据，尽量避免频繁操作'
      />,
      onOk: () => this.initConfirm(),
      onCancel() {
        console.log('Cancel');
      },
    });
  };


  changeState = ({ courseId, courseState }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        courseState: courseState === '0' ? '1' : '0',
        courseId,
      },
      // callback: courseState === '0' ? null : this.showWarning, //提示全部初始化
    });
  };

  showWarning = () => {
    this.setState({
      showWarning: true,
    });
  };

  hideWarning = () => {
    this.setState({
      showWarning: false,
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
      [namespace]: { listData ,pagination},
      listLoading,
      adding,
      updateLoading,
      initLoading,
      batchAddLoading,
    } = this.props;
    const { nowPage, pageSize, totalCount } = pagination;
    const { showWarning } = this.state;
    return (
      <PageHeaderWrapper title="课程管理">
        <Card
          bordered={false}
          title={
            <div className={styles.tableListOperator}>
              <FormModal record={{}} loading={adding} onOk={this.handleAddClick}>
                <Button icon="plus" type="primary">
                  添加课程
                </Button>
              </FormModal>
              <AddModal loading={batchAddLoading} onOk={this.handleBatchAddClick}>
                <Button style={{ marginLeft: '20px' }} icon="plus" type="primary">
                  批量添加课程
                </Button>
              </AddModal>
            </div>
          }
          extra={this.extraBox()}
        >
          <div className={styles.tableList}>
            {
              showWarning
                ?
                <Alert
                  message="提示"
                  type="warning"
                  description='在完成所有撤回操作后，需点击右上角“初始化”按钮同步更新APP下载页面课程列表。'
                  showIcon
                />
                :
                null
            }
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading || updateLoading || initLoading}
              dataSource={listData}
              rowKey={record => record.courseId}
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

export default Lessons;
