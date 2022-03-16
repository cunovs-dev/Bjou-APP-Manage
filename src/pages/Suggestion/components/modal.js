import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

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
    const { replyContent = '' } = record;
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
          title="回复"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
             <FormItem label="回复建议" hasFeedback>
              {getFieldDecorator('replyContent', {
                initialValue: replyContent,
                rules: [{ required: true, message: '请回复建议' }],
              })(<TextArea rows={6}/>)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
