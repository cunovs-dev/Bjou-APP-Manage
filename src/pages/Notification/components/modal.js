import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

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
    const { children, form, record, loading } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const { noticeTitle = '', noticeContent = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width='50vw'
          title={`${record.noticeId ? '修改' : '新建'}通知公告`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="标题" hasFeedback>
              {getFieldDecorator('noticeTitle', {
                initialValue: noticeTitle,
                rules: [{ required: false, message: '标题不能为空' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="编辑公告" hasFeedback>
              {getFieldDecorator('noticeContent', {
                initialValue: noticeContent,
                rules: [{ required: true, message: '请编辑公告' }],
              })(<TextArea rows={6}/>)}
            </FormItem>
            {
              record.noticeId ? null :
                <FormItem label="发布方式">
                  {getFieldDecorator('publishType', {
                    initialValue: 1,
                    rules: [{ required: false, message: '标题不能为空' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>自动发布</Radio>
                      <Radio value={2}>手动发布</Radio>
                    </Radio.Group>)}
                </FormItem>
            }
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
