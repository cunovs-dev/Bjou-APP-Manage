import React, { Component } from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class AddModal extends Component {
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
    const { children, form, record, loading } = this.props;
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
          width='50vw'
          title="批量添加课程"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="课程名称" hasFeedback>
              {getFieldDecorator('lessons', {
                initialValue: '',
                rules: [{ required: true, message: '请添加课程名称' }],
              })(<TextArea rows={6}/>)}
            </FormItem>
            {
              <FormItem wrapperCol={{ span: 6, offset: 6 }}>
                {getFieldDecorator('init', {
                  initialValue: true,
                })(
                  <Checkbox defaultChecked>自动初始化课程</Checkbox>,
                )}
              </FormItem>
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AddModal);
