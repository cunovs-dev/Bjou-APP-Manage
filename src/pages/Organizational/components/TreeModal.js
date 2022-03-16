import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { pattern } from '../../../utils/utils';

const FormItem = Form.Item;

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  showModelHandler = e => {
    const { selectedKey, type } = this.props;
    if (e) e.stopPropagation();
    if (selectedKey === '' && type === 'edit') {
      message.error('请选择一个菜单');
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  hideModelHandler = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values, this.hideModelHandler);
      }
    });
  };

  render() {
    const { children, form, loading, record = {}, type = 'create' } = this.props;
    const { deptName = '', sort = '', deptId } = record;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={600}
          title={`${deptId ? '修改' : '新建'}部门`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem {...formItemLayout} label="名称" hasFeedback>
              {getFieldDecorator('deptName', {
                initialValue: deptName,
                rules: [{ required: true, message: '请输入组织机构名称' }],
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="排序" hasFeedback>
              {getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
              })(<InputNumber/>)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
