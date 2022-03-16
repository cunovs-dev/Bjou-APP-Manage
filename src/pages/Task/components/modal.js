import React, { Component } from 'react';
import { taskType, taskCycle } from '@/utils/utils';
import { Modal, Form, Input, Checkbox, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class FormModal extends Component {
  constructor(props) {
    super(props);
    const { taskContent = [] } = props.record;
    this.state = {
      visible: false,
    };
  }

  close = () => {
    this.setState({});
  };

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
    const { taskName = '', taskId = '', taskTime, taskContent = '' } = record;
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
          title={taskId ? '修改' : '新建'}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
          afterClose={taskId ? null : this.close}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="任务名称" hasFeedback>
              {getFieldDecorator('taskName', {
                initialValue: taskName,
                rules: [{ required: true, message: '请输入任务名称' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="任务执行时间" hasFeedback>
              {getFieldDecorator('taskTime', {
                initialValue: parseInt(taskTime, 10) || 1,
                rules: [{ required: true, message: '请选择执行时间' }],
              })(
                <Select style={{ width: 120 }} onChange={this.handleChange}>
                  {taskCycle.map((item) => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="任务类型">
              {getFieldDecorator('taskContent', {
                initialValue: taskContent === '' ? [] : taskContent.split(',').map(Number),
                rules: [{ required: true, message: '请输入任务类型' }],
              })(
                <Checkbox.Group
                  options={taskType}
                />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
