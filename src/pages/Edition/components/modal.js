import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, message, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;

class FormModal extends Component {
  constructor(props) {
    const { record: { appVersionType = 'Android' } } = props;
    super(props);
    this.state = {
      visible: false,
      fileList: [],
      versionType: appVersionType,
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
    const { onOk, form, record } = this.props;
    const { fileList } = this.state;
    const { versionId } = record;
    form.validateFields((err, values) => {
      const formData = new FormData();
      if (values !== '') {
        Object.keys(values).map(item => (formData.append(item, values[item])));
      }
      if (fileList.length > 0) formData.append('apk', fileList[0]);

      // @ts-ignore
      if (!err) {
        record.appVersion
          ?
          onOk({ ...values, versionId }, this.hideModelHandler)
          :
          onOk(formData, this.hideModelHandler);
      }
    });
  };

  handlerChangeType = e => {
    this.setState({
      versionType: e.target.value,
    });
  };

  render() {
    const { children, form, record, loading } = this.props;
    const { visible, versionType } = this.state;
    const { getFieldDecorator } = form;
    const { appVersion = '', appVersionType = 'Android', appUpdateInfo = '', androidDownUrl = '', iosDownUrl = '' } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        if (!/android/.test(file.type)) {
          message.error('????????????????????????????????????');
          return false;
        }
        this.setState(() => ({
          fileList: [file],
        }));

        return false;
      },
      fileList: this.state.fileList,
      // disabled: this.state.fileList.length > 0,
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={600}
          title={`${record.appVersion ? '??????' : '??????'}??????`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          confirmLoading={loading}
        >
          <Form {...formItemLayout} layout='horizontal' onSubmit={this.okHandler}>
            <FormItem label="??????">
              {getFieldDecorator('appVersionType', {
                initialValue: versionType,
                rules: [{ required: true, message: '?????????????????????' }],
              })(<Radio.Group disabled={!!record.appVersion} buttonStyle="solid" onChange={this.handlerChangeType}>
                <Radio.Button value="Android">??????</Radio.Button>
                <Radio.Button value="IOS">IOS</Radio.Button>
              </Radio.Group>)}
            </FormItem>
            <FormItem label="?????????" hasFeedback>
              {getFieldDecorator('appVersion', {
                initialValue: appVersion,
                rules: [{ required: true, message: '?????????????????????' }],
              })(<Input disabled={!!record.appVersion}/>)}
            </FormItem>
            {
              versionType === 'Android' ?
                <FormItem label="??????????????????" hasFeedback>
                  {getFieldDecorator('androidDownUrl', {
                    initialValue: androidDownUrl,
                    rules: [{ required: true, message: '????????????????????????' }],
                  })(<Input/>)}
                </FormItem>
                :
                <FormItem label="IOS????????????" hasFeedback>
                  {getFieldDecorator('iosDownUrl', {
                    initialValue: iosDownUrl,
                    rules: [{ required: true, message: '????????????????????????' }],
                  })(<Input/>)}
                </FormItem>
            }
            <FormItem label="????????????" hasFeedback>
              {getFieldDecorator('appUpdateInfo', {
                initialValue: appUpdateInfo,
                rules: [{ required: true, message: '?????????????????????' }],
              })(<TextArea/>)}
            </FormItem>
            {
              record.appVersion || versionType === 'IOS' ?
                null
                :
                <FormItem label="??????APP" hasFeedback>
                  <Dragger {...props} disabled={!!record.appVersion}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">????????????</p>
                    <p className="ant-upload-hint">
                      ????????????????????????
                    </p>
                  </Dragger>
                </FormItem>
            }

          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(FormModal);
