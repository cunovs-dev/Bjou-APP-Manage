import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const getFistKey = (obj) => {
  for (const i in obj) {
    return i;
  }
};

class FormModal extends Component {

  constructor(props) {
    const { alertInfo } = props;
    super(props);
    this.state = {
      visible: false,
      currentInfo: getFistKey(alertInfo)||'scriptWarn',
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
    const { onOk, form, types } = this.props;
    const { currentInfo } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(types || currentInfo, values, this.hideModelHandler);
      }
    });
  };

  onChange = (e) => {
    const { form: { setFieldsValue }, alertInfo, param } = this.props;
    this.setState({
      currentInfo: e.target.value,
    });
    setFieldsValue({
      [param]: alertInfo[e.target.value],
    });
  };

  renderVideo = (val) => {
    switch (val) {
      case  'scriptWarn':
        return '资源脚本弹窗提示';
      case  'scriptInfo':
        return '资源脚本滚动提示';
      case  'siteMaintenance':
        return '维护模式提示语';
      case  'loginInfo':
        return '登录提示';
      default :
        return '未定义';
    }
  };

  getInfoTypes = (info) => {
    const { currentInfo } = this.state;
    return (
      <Radio.Group style={{ marginBottom: '10px' }} onChange={this.onChange} defaultValue={currentInfo}>
        {
          Object.keys(info).map(item => {
            return (
              <Radio.Button value={item}>{this.renderVideo(item)}</Radio.Button>
            );
          })
        }
      </Radio.Group>
    );
  };

  render() {
    const { children, form, title = '', label = '课程ID', param = 'course', alertInfo, loading } = this.props;
    const { visible, currentInfo } = this.state;
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
          title={title}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          {alertInfo ? this.getInfoTypes(alertInfo) : null}
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label={label} hasFeedback>
              {getFieldDecorator(param, {
                initialValue: alertInfo ? alertInfo[currentInfo] : '',
                rules: [{ required: !alertInfo, message: '请输入' }],
              })(<TextArea rows={6} />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
