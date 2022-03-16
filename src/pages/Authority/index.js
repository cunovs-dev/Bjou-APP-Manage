/* eslint-disable no-script-url,no-param-reassign */
import React, { Component } from 'react';
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
  Switch,
  Spin,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const namespace = 'authority';
const { TreeNode } = Tree;
const getDefaultMenuData = (datas) => {
  const arr = [];
  datas.map((item) => {
    if (item.menuId === '') {
      return arr;
    } else {
      arr.push({
        userId: item.userId,
        menuId: item.menuId,
      });
    }
  });
  return arr;
};

/* eslint react/no-multi-comp:0 */
@connect(({ authority, loading }) => ({
  authority,
  treeLoading: loading.effects[`${namespace}/fetchDept`],
  userLoading: loading.effects[`${namespace}/queryUser`],
  adding: loading.global,
}))

class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: [],
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { [namespace]: { userData } } = this.props;
  //   this.setState({
  //     menuData: getDefaultMenuData(userData),
  //   });
  //
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetchDept`,
    });
    dispatch({
      type: `${namespace}/fetchMenu`,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/save`,
      payload: {
        menuData: [],
        treeData: [],
        userData: [],
        itemDate: {},
        children: [],
      },
    });
    this.setState({
      menuData: [],
    });
  }

  updateMenuDatas = (userData) => {
    this.setState({
      menuData: getDefaultMenuData(userData),
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
        callback: this.updateMenuDatas,
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


  handlerChange = (id, menuId) => {
    // const { [namespace]: { userData } } = this.props;
    // const menuData = getDefaultMenuData(userData);
    const { menuData } = this.state;
    const index = menuData.findIndex((item => item.userId === id));
    if (index === -1) {
      menuData.push({
        userId: id,
        menuId,
      });
    } else {
      const menuDataArr = menuData[index].menuId.split(',');
      const i = menuDataArr.indexOf(menuId);
      if (menuDataArr.includes(menuId)) {
        menuDataArr.splice(i, 1);
        menuData[index].menuId = menuDataArr.join(',');
      } else {
        menuDataArr.push(menuId);
        menuData[index].menuId = menuDataArr.join(',');
      }
    }
    this.setState({
      menuData,
    });
  };

  saveAuthority = () => {
    const { dispatch } = this.props;
    const { menuData } = this.state;
    dispatch({
      type: `${namespace}/saveAuthority`,
      payload: {
        menuData: JSON.stringify(menuData),
      },
    });
  };

  getColumns = () => {
    const { [namespace]: { menuData } } = this.props;
    const result = [];
    const columns = [
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
    ];
    menuData.map((item) => {
      result.push({
        title: item.menuName,
        dataIndex: item.menuId,
        key: item.menuId,
        render: (text, record) => {
          const { userMenuList, userId } = record;
          // console.log(userMenuList);
          return (
            <Switch
              defaultChecked={userMenuList.find(data => data.menuId === item.menuId)}
              checkedChildren={<Icon type="check"/>}
              unCheckedChildren={<Icon type="close"/>}
              onChange={() => this.handlerChange(userId, item.menuId)}
            />
          );
        },
      });
    });
    return columns.concat(result);
  };

  buttonBox = () => {
    return (<Button type="primary" onClick={this.saveAuthority}>保存</Button>);
  };

  render() {
    const {
      [namespace]: { treeData, userData, pagination },
      treeLoading,
      userLoading,
    } = this.props;
    const { nowPage, pageSize, totalCount } = pagination;
    return (
      <PageHeaderWrapper title="权限管理">
        <GridContent>
          <Row gutter={24}>
            <Col lg={4} md={24}>
              <Card
                bordered={false}
                title="部门用户"
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
            <Col lg={20} md={24}>
              <Card title='权限列表' extra={this.buttonBox()}>
                <Table
                  bordered={false}
                  columns={this.getColumns()}
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

export default Authority;
