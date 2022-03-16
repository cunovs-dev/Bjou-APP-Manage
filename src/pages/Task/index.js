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
import { taskType,taskCycle } from '@/utils/utils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'task';
const getType = (item) => taskType[item] && taskType[item].label;
const getCycle = (item) => taskCycle[item] && taskCycle[item].label;

/* eslint react/no-multi-comp:0 */
@connect(({ task, loading }) => ({
  task,
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
      dataIndex: 'taskName',
    },
    {
      title: '执行时间',
      dataIndex: 'taskTime',
      render(text) {
        return (<Tag color='cyan'>{getCycle(parseInt(text, 10))}</Tag>);
      },
    },
    {
      title: '执行内容',
      dataIndex: 'taskContent',
      render(text) {
        return text && text.split(',').map((item, index) =>
          <Tag
            key={index}
            color='magenta'
          >
            {getType(parseInt(item, 10))}
          </Tag>);
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
                (values, callback) => this.handleUpdateClick(values, callback, record.taskId)
              }
            >
              <a href="javascript:void(0);">修改</a>
            </FormModal>
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.confirm(record.taskId)}
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

  getValues = (values) => {
    return {
      taskName: values.taskName,
      taskTime: values.taskTime,
      taskContent: values.taskContent.join(','),
    };
  };

  handleAddClick = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/add`,
      payload: this.getValues(values),
      callback,
    });
  };

  handleUpdateClick = (values, callback, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        ...this.getValues(values),
        taskId: id,
      },
      callback,
    });
  };

  confirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteTask`,
      payload: {
        taskId: id,
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
      <PageHeaderWrapper title="任务管理">
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
              rowKey={record => record.taskId}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Service;
