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
  message,
  Spin,
  Form,
  Input,
  Empty,
  InputNumber,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TreeModal from './components/TreeModal';
import { pattern } from '../../utils/utils';

const namespace = 'menuManage';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 6 },
};

/* eslint react/no-multi-comp:0 */
@connect(({ menuManage, loading }) => ({
  menuManage,
  treeLoading: loading.effects[`${namespace}/fetchMenu`],
  adding: loading.global,
}))

class MenuManage extends PureComponent {
  state = {
    disabled: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetchMenu`,
    });
  }

  createHandler = (values, callback) => {
    const {
      dispatch,
      [namespace]: { selectedKey },
    } = this.props;
    dispatch({
      type: `${namespace}/addMenu`,
      payload: {
        ...values,
        pMenuId: selectedKey===''?undefined:selectedKey,
      },
      callback,
    });
  };

  editorSuccess=()=>{
    this.setState({
      disabled: true,
    });
  }

  editHandler = () => {
    const {
      form, dispatch,
      [namespace]: { selectedKey, itemDate },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: `${namespace}/upDateMenu`,
          payload: {
            ...values,
            menuId: selectedKey,
            pMenuId: itemDate.pMenuId || '',
          },
          callback:this.editorSuccess
        });
      }
    });
  };

  handlerUpdateClick = () => {
    this.setState({
      disabled: false,
    });
  };

  editorUserBox = () => {
    const {
      [namespace]: { itemDate },
    } = this.props;
    const { menuId = '',} = itemDate;
    const { disabled } = this.state;
    return (
      <div>
        <Button disabled={ menuId === ''} onClick={disabled ? this.handlerUpdateClick : this.editHandler} type="primary" size="small">
          {disabled ? '修改' : '保存'}
        </Button>
      </div>
    );
  };

  handlerTreeSelect = (key) => {
    const { dispatch } = this.props;
    if (key.length > 0) {
      dispatch({
        type: `${namespace}/save`,
        payload: {
          selectedKey: key,
        },
      });
      dispatch({
        type: `${namespace}/queryItemMenu`,
        payload: { menuId: key.join('') },
      });
    } else {
      message.error('未选择菜单');
    }
  };


  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.menuName}
            key={item.menuId}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.menuName}
          key={item.menuId}
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
          pMenuId: treeNode.props.eventKey,
        },
        callback: res => {
          treeNode.props.dataRef.children = res;
        },
      }).then(() => {
        resolve();
      });
    });
  };


  render() {
    const {
      [namespace]: { menuData, selectedKey, itemDate },
      treeLoading,
      adding,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { menuId = '', menuName = '', menuEntrance = '', menuIcon = '', sort = '' } = itemDate;
    const { disabled } = this.state;
    return (
      <PageHeaderWrapper title="菜单管理">
        <GridContent>
          <Row gutter={24}>
            <Col lg={6} md={24}>
              <Card
                bordered={false}
                title="菜单管理"
                extra={
                  <TreeModal
                    record={{}}
                    loading={adding}
                    selectedKey={selectedKey}
                    type="create"
                    onOk={(values, callback) => this.createHandler(values, callback)}
                  >
                    <Button type="primary" size="small" ghost>
                      新建
                    </Button>
                  </TreeModal>
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
                    {this.renderTreeNodes(menuData)}
                  </Tree>
                )}
              </Card>
            </Col>
            <Col lg={18} md={24}>
              <Card title='菜单管理' extra={this.editorUserBox()}>
                {
                  menuId === '' ?
                    <Empty/>
                    :
                    <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
                      <FormItem {...formItemLayout} label="名称" hasFeedback>
                        {getFieldDecorator('menuName', {
                          initialValue: menuName,
                          rules: [{ required: true, message: '请输入菜单名称' }],
                        })(<Input disabled={disabled}/>)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="地址" hasFeedback>
                        {getFieldDecorator('menuEntrance', {
                          initialValue: menuEntrance,
                          rules: [{ required: true, message: '请输入地址' }],
                        })(<Input disabled={disabled}/>)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="图标" hasFeedback>
                        {getFieldDecorator('menuIcon', {
                          initialValue: menuIcon,
                        })(<Input disabled={disabled}/>)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="排序" hasFeedback>
                        {getFieldDecorator('sort', {
                          initialValue: sort,
                          rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
                        })(<InputNumber disabled={disabled}/>)}
                      </FormItem>
                    </Form>
                }
              </Card>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MenuManage);
