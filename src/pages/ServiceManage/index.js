/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Button,
  Popconfirm,
  Switch,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'serviceManage';


/* eslint react/no-multi-comp:0 */
@connect(({ serviceManage, loading }) => ({
  serviceManage,
  initializing: loading.effects[`${namespace}/initialize`],
  setInfoing: loading.effects[`${namespace}/setInfo`],
}))


class ServiceManage extends PureComponent {

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '状态',
      dataIndex: 'courseState',
      render: (text, record) => {
        const { [namespace]: { adding } } = this.props;
        if (record.key === 4) {
          return (
            <FormModal
              alertInfo={record.alertInfo}
              param='txt'
              label='提示信息'
              title='设置提示信息'
              loading={adding}
              onOk={
                (code, values, callback) => this.handleSetInfoClick(code, values, callback)
              }
            >
              <a href="javascript:;">修改</a>
            </FormModal>
          );
        }
        return (
          <Popconfirm
            title={`确定要改变当前状态吗?`}
            onConfirm={() => this.changeState(record.code)}
            okText="确定"
            cancelText="取消"
          >
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              checked={record.isActive}
            />
          </Popconfirm>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/getState`,
    });
    dispatch({
      type: `${namespace}/getInfo`,
    });
  }

  initialize = (types, values, callback) => {
    message.loading('正在初始化...', 0);
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/initialize`,
      payload: {
        types,
        ...values,
      },
      callback,
    });
  };

  handleSetInfoClick = (code, values, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/setInfo`,
      payload: {
        ...values,
        code,
      },
      callback,
    });
  };

  changeState = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/changeState`,
      payload: {
        code,
      },
      callback: (state) => {
        dispatch({
          type: `${namespace}/save`,
          payload: {
            [code]: state,
          },
        });
      },
    });
  };


  render() {
    const {
      initializing,
      [namespace]: {
        l,
        f,
        r,
        alertInfo,
      },
    } = this.props;
    const list = [
      {
        key: 1,
        state: '是否输出通信日志',
        code: 'l',
        isActive: l,
      },
      {
        key: 2,
        state: '同步时，是否清空缓存',
        code: 'f',
        isActive: f,
      },
      {
        key: 3,
        state: 'app是否为审核状态',
        code: 'r',
        isActive: r,
      },
      {
        key: 4,
        state: 'app首页弹窗内容',
        alertInfo,

      },
    ];
    return (
      <PageHeaderWrapper title="数据初始化管理">
        <Card
          bordered={false}
          title={
            <div className={styles.tableListOperator}>
              <FormModal title="初始化课程" types='c' loading={initializing} onOk={this.initialize}>
                <Button type="primary">
                  初始化课程
                </Button>
              </FormModal>
              <FormModal title="初始化课程考勤" types='a' loading={initializing} onOk={this.initialize}>
                <Button style={{ marginLeft: '20px' }} type="primary">
                  初始化课程考勤
                </Button>
              </FormModal>
              <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => this.initialize('u')}>
                初始化用户
              </Button>
              <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => this.initialize('r')}>
                初始化教师角色
              </Button>
            </div>
          }

        >
          <div className={styles.tableList}>
            <Table
              bordered={false}
              columns={this.columns}
              dataSource={list}
              rowKey={record => record.key}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ServiceManage;
