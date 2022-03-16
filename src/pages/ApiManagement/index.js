/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Card,
  Button,
  Table,
  Popconfirm,
  Input,
  Form,
  Tag,
  Divider,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormModal from './components/modal';
import styles from './index.less';

const namespace = 'apimanagement';

/* eslint react/no-multi-comp:0 */
@connect(({ apimanagement, loading }) => ({
  apimanagement,
  listLoading: loading.effects[`${namespace}/fetch`],
  adding: loading.global,
}))

class ApiManagement extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '容器名称',
      dataIndex: 'containerName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        if (text === '0') {
          return <Tag color="red">已停止</Tag>;
        }
        if (text === '1') {
          return <Tag color="green">运行中</Tag>;
        }
        return '-';
      },
    },
    {
      title: '版本信息',
      dataIndex: 'appUpdateInfo',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '镜像',
      dataIndex: 'images',
    },
    {
      title: '挂载参数',
      dataIndex: 'mountParams',
    },
    {
      title: '环境参数',
      dataIndex: 'envParams',
      render(text) {
        return (
          <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'infos',
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
              <a href="javascript:void(0);">修改</a>
            </FormModal>
            <Divider type="vertical"/>
            {
              record.status === '0' ?
                <>
                  <a
                    href="javascript:;"
                    onClick={() => this.handlerStart(record)}
                  >
                    启用
                  </a>
                  <Divider type="vertical"/>
                  <Popconfirm
                    title="确定删除止吗?"
                    onConfirm={() => this.handlerDelete(record)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                </>
                :
                <Popconfirm
                  title="确定要停止吗?"
                  onConfirm={() => this.handlerStop(record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:;">停止</a>
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
      payload: {
        ...values,

      },
      callback,
    });
  };

  handlerStart = ({ containerName = '', containerPort = '', containerMount = '', containerEnv = '', images = '' }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/start`,
      payload: {
        containerName,
        containerPort,
        containerMount,
        containerEnv,
        images,
      },
    });
  };

  handlerDelete = ({ containerName = '' }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteContainer`,
      payload: {
        containerName,
      },
    });
  };

  handlerStop = ({ containerName = '' }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/stop`,
      payload: {
        containerName,
      },
    });
  };

  handlerSearch = () => {
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      const { filter } = values;
      if (!err) {
        dispatch({
          type: `${namespace}/fetch`,
          payload: {
            filter,
          },
        });
      }
    });
  };

  handlerReset = () => {
    const { form } = this.props;
    const { dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: `${namespace}/fetch`,
    });

  };

  render() {
    const {
      [namespace]: { listData },
      listLoading,
      adding,
    } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <PageHeaderWrapper title="后台接口管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <FormModal record={{}} loading={adding} onOk={this.handleAddClick}>
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </FormModal>
              <div className={styles.search}>
                <Form layout="inline">
                  <Form.Item>
                    {getFieldDecorator('filter', {})(
                      <Input
                        placeholder="搜索"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.handlerSearch}>
                      搜索
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={this.handlerReset}>
                      重置
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <Table
              bordered={false}
              columns={this.columns}
              loading={listLoading}
              dataSource={listData}
              rowKey={record => record.key}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ApiManagement);
