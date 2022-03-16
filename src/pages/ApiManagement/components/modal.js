import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const Images = [
  {
    label: 'bkapp-api:2.3.0',
    value: 'bkapp-api:2.3.0',
  },
  {
    label: 'bkapp-api:2.2.7',
    value: 'bkapp-api:2.2.7',
  },
  {
    label: 'bkappmgr:2.0.7',
    value: 'bkappmgr:2.0.7',
  },
  {
    label: 'bkappmgr:2.0.3',
    value: 'bkappmgr:2.0.3',
  },
  {
    label: 'bkappmgr-api:2.1.6',
    value: 'bkappmgr-api:2.1.6',
  },
  {
    label: 'bkappmgr-api:2.1.1',
    value: 'bkappmgr-api:2.1.1',
  },
  {
    label: 'bkapp:2.0.3',
    value: 'bkapp:2.0.3',
  },
];

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
    const { containerName = '', images = 'bkapp-api:2.3.0', containerPort = '', infos = '', mountParams = '', envParams = '' } = record;
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
          title={containerName ? '修改' : '新建'}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="容器名称" hasFeedback>
              {getFieldDecorator('containerName', {
                initialValue:containerName,
                rules: [{ required: true, message: '请输入容器名称' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="镜像选择" hasFeedback>
              {getFieldDecorator('images', {
                initialValue: images,
                rules: [{ required: true, message: '请选择镜像' }],
              })(
                <Select style={{ width: 220 }} onChange={this.handleChange}>
                  {Images.map((item) => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="端口" hasFeedback>
              {getFieldDecorator('containerPort', {
                initialValue: containerPort,
                rules: [{ required: true, message: '请输入端口' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('infos', {
                initialValue:infos,
              })(<TextArea rows={6}/>)}
            </FormItem>
            <FormItem label="挂载参数">
              {getFieldDecorator('mountParams', {
                initialValue: mountParams,
              })(<Input/>)}
            </FormItem>
            <FormItem label="环境参数">
              {getFieldDecorator('envParams', {
                initialValue:envParams,
              })(<Input/>)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
