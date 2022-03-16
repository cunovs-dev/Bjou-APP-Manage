/* eslint-disable no-script-url,no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Button,
  Tree,
  Icon,
  Table,
  message,
  Pagination,
  Dropdown,
  Menu,
  Spin,
  Modal,
  Popconfirm,
  Divider,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserModal from './components/UserModal';
import TreeModal from './components/TreeModal';

const namespace = 'organizational';
const { TreeNode } = Tree;
const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({ organizational, loading }) => ({
  organizational,
  treeLoading: loading.effects[`${namespace}/fetchDept`],
  userLoading: loading.effects[`${namespace}/queryUser`],
  adding: loading.global,
}))

class Organizational extends PureComponent {
  state = {};

  columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
      render: val => {
        if (val && val !== '') {
          return val;
        }
        return '未填写';
      },
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
      render: val => {
        if (val && val !== '') {
          return val;
        }
        return '未填写';
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'userRealName',
      key: 'userRealName',
    },
    {
      title: '性别',
      dataIndex: 'userSex',
      key: 'userSex',
      render: (val) => {
        if (val === '0') {
          return '男';
        }
        if (val === '1') {
          return '女';
        }
        return '-';
      },
    },
    {
      title: '年龄',
      dataIndex: 'userAge',
      key: 'userAge',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'userState',
    //   key: 'userState',
    //   render: (val) => {
    //     if (val === '1') {
    //       return <Tag color="green">正常</Tag>;
    //     }
    //     if (val === '2') {
    //       return <Tag color="red">冻结</Tag>;
    //     }
    //     if (val === '3') {
    //       return <Tag color="gray">停用</Tag>;
    //     }
    //     return '-';
    //   },
    // },
    {
      title: '操作',
      render: (text, record) => {
        const { adding, [namespace]: { itemUser } } = this.props;
        return (
          <>
            <UserModal
              record={itemUser}
              loading={adding}
              onOk={(values, callback) => this.editUserHandler(values, record.userId, callback)}
              onUpload={(values) => this.handlerUpload(values)}
            >
              <a href="javascript:void(0);" onClick={() => this.editorUserHandler(record.userId)}>编辑</a>
            </UserModal>
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.confirm(record.userId)}
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
      type: `${namespace}/fetchDept`,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/clear`,
    });
  }

  createHandler = (values, callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey },
    } = this.props;
    dispatch({
      type: `${namespace}/addDept`,
      payload: {
        ...values,
        parentDept: selectedKey,
      },
      callback,
    });
  };

  editHandler = (values, callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey, itemDate },
    } = this.props;
    dispatch({
      type: `${namespace}/upDateDept`,
      payload: {
        ...values,
        deptId: selectedKey,
        parentDept: itemDate.parentDept || '',
      },
      callback,
    });
  };

  deleteHandler = (values, callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey },
    } = this.props;
    dispatch({
      type: `${namespace}/dvalidate`,
      payload: {
        deptId: selectedKey,
      },
      callback,
    });
  };

  createUserHandler = (values, callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey, photoPath },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个部门');
    } else {
      dispatch({
        type: `${namespace}/addUser`,
        payload: {
          ...values,
          photoPath,
          deptId: selectedKey,
        },
        callback,
      });
    }
  };

  editorUserHandler = (id) => {
    const {
      dispatch,
      [namespace]: { selectedKey },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个部门');
    } else {
      dispatch({
        type: `${namespace}/queryItemUser`,
        payload: {
          userId: id,
        },
      });
    }
  };

  editUserHandler = (values, id, callback) => {
    const { dispatch, [namespace]: { photoPath } } = this.props;
    dispatch({
      type: `${namespace}/upDateUser`,
      payload: {
        ...values,
        photoPath,
        userId: id,
      },
      callback,
    });
  };


  confirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteUser`,
      payload: {
        userId: id,
      },
    });
  };

  handlerUpload = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/uploadAvatar`,
      payload: value,
    });
  };

  createUserBox = () => {
    const {
      [namespace]: { selectedKey },
    } = this.props;
    return (
      <div>
        <UserModal
          record={{}}
          selectedKey={selectedKey}
          onOk={(values, callback) => this.createUserHandler(values, callback)}
          onUpload={(values) => this.handlerUpload(values)}
        >
          <Button type="primary">
            添加用户
          </Button>
        </UserModal>
      </div>
    );
  };

  editMenu = (callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey },
    } = this.props;
    dispatch({
      type: `${namespace}/queryItemDept`,
      payload: { deptId: selectedKey },
      callback,
    });
  };

  handlerTreeSelect = (key) => {
    const { dispatch, [namespace]: { pagination } } = this.props;
    const { nowPage, pageSize } = pagination;
    if (key.length > 0) {
      dispatch({
        type: `${namespace}/save`,
        payload: {
          selectedKey: key,
        },
      });
      dispatch({
        type: `${namespace}/queryUser`,
        payload: {
          deptId: key.join(''),
          nowPage,
          pageSize,
        },
      });
    } else {

      message.error('未选择菜单');
    }
  };

  pageChangeHandler = page => {
    const {
      dispatch,
      [namespace]: { pagination, selectedKey },
    } = this.props;
    dispatch({
      type: `${namespace}/updatePagination`,
      payload: {
        ...pagination,
        nowPage: page,
      },
    });
    dispatch({
      type: `${namespace}/queryUser`,
      payload: {
        nowPage: page,
        pageSize: pagination.pageSize,
        deptId: selectedKey,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const { dispatch, [namespace]: { pagination, selectedKey } } = this.props;
    dispatch({
      type: `${namespace}/updatePagination`,
      payload: {
        ...pagination,
        pageSize,
      },
    });
    dispatch({
      type: `${namespace}/queryUser`,
      payload: {
        nowPage: current,
        pageSize,
        deptId: selectedKey,
      },
    });
  };

  menu = () => {
    const {
      [namespace]: { selectedKey, itemDate },
      adding,
    } = this.props;
    return (
      <Menu>
        <Menu.Item>
          <TreeModal
            record={{}}
            loading={adding}
            selectedKey={selectedKey}
            type="create"
            onOk={(values, callback) => this.createHandler(values, callback)}
            onRef={this.onRef}
          >
            <Button type="primary" size="small" ghost>
              新建
            </Button>
          </TreeModal>
        </Menu.Item>
        <Menu.Item>
          <TreeModal
            record={itemDate}
            selectedKey={selectedKey}
            loading={adding}
            type="edit"
            onOk={(values, callback) => this.editHandler(values, callback)}
            onRef={this.onRef}
          >
            <Button
              type="primary"
              size="small"
              ghost
              style={{ marginRight: '5px' }}
              onClick={() => this.editMenu(this.child.showModelHandler)}
            >
              修改
            </Button>
          </TreeModal>
        </Menu.Item>
        <Menu.Item>
          <Button
            type="primary"
            size="small"
            ghost
            style={{ marginRight: '5px' }}
            onClick={() => this.showDeleteConfirm()}
          >
            删除
          </Button>
        </Menu.Item>
      </Menu>
    );
  };


  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.deptName}
            key={item.deptId}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.deptName}
          key={item.deptId}
          dataRef={item}
        />
      );
    });

  onLoadData = treeNode => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      dispatch({
        type: `${namespace}/fetchChildren`,
        payload: {
          parentId: treeNode.props.eventKey,
        },
        callback: res => {
          treeNode.props.dataRef.children = res;
        },
      }).then(() => {
        resolve();
      });
    });
  };


  onRef = (ref) => {
    this.child = ref;
  };

  showDeleteConfirm = () => {
    const {
      [namespace]: { selectedKey },
    } = this.props;
    if (selectedKey === '') {
      message.error('请选择一个部门');
    } else {
      confirm({
        title: '删除',
        content: '删除后不可恢复,请谨慎操作',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => this.deleteHandler(),
        onCancel() {
          console.log('Cancel');
        },
      });
    }

  };


  render() {
    const {
      [namespace]: { treeData, userData, pagination },
      treeLoading,
      userLoading,
    } = this.props;
    const { nowPage, pageSize, totalCount } = pagination;
    return (
      <PageHeaderWrapper title="用户管理">
        <GridContent>
          <Row gutter={24}>
            <Col lg={6} md={24}>
              <Card
                bordered={false}
                title="组织机构管理"
                extra={
                  <Dropdown overlay={this.menu()} placement="bottomCenter">
                    <Button type="primary" ghost>编辑</Button>
                  </Dropdown>
                }
              >
                {treeLoading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Spin/>
                  </div>
                ) : (
                  <Tree
                    blockNode
                    defaultCheckedKeys={[]}
                    switcherIcon={<Icon type="down" style={{ fontSize: '16px' }}/>}
                    onSelect={this.handlerTreeSelect}
                    loadData={this.onLoadData}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>
                )}
              </Card>
            </Col>
            <Col lg={18} md={24}>
              <Card title='用户管理' extra={this.createUserBox()}>
                <Table
                  bordered={false}
                  columns={this.columns}
                  loading={userLoading}
                  dataSource={userData}
                  rowKey={record => record.userId}
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
              </Card>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Organizational;
