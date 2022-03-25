import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { pattern } from '../../../utils/utils';

const FormItem = Form.Item;

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
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
    const { children, form, loading, record } = this.props;
    const { courseId = '', courseName = '', courseSort = '' } = record;
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
          title="添加课程"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="课程ID" hasFeedback>
              {getFieldDecorator('courseId', {
                initialValue: courseId,
                rules: [{ required: true, message: '请输入课程ID' }],
              })(<Input disabled={courseId !== ''}/>)}
            </FormItem>
            <FormItem label="课程名称" hasFeedback>
              {getFieldDecorator('courseName', {
                initialValue: courseName,
                rules: [{ required: true, message: '请输入课程名称' }],
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="排序" hasFeedback>
              {getFieldDecorator('courseSort', {
                initialValue: courseSort,
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
