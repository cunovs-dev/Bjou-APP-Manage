import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, Upload, Icon, message } from 'antd';
import md5 from 'md5';
import { pattern } from '../../../utils/utils';
import styles from '../Organizational.less';

const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


class UserModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      photoPath: '',
    };
  }

  componentDidMount() {
    this.setState((state, props) => (
      { photoPath: props.record.photoPath }
    ));
  }

  componentWillReceiveProps(nextProps){
    const {record} = this.props
    if(record!==nextProps.record){
      this.setState(() => (
        { photoPath: nextProps.record.photoPath }
      ));
    }
  }

  showModelHandler = e => {
    const { selectedKey } = this.props;
    if (e) e.stopPropagation();
    if (selectedKey === '') {
      message.error('请选择一个部门');
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
      const { userPwd } = values;
      if (!err) {
        const res = {
          ...values,
          userPwd: userPwd !== '' ? md5(userPwd) : undefined,
        };
        onOk(res, this.hideModelHandler);
      }
    });
  };


  beforeUpload = (file) => {
    const { onUpload } = this.props;
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件必须小于2M!');
      return false;
    }
    if (!pattern.pic.pattern.test(file.type)) {
      message.error('请检查上传的是否是图片格式的文件');
      return false;
    }
    getBase64(file, photoPath =>
      this.setState({
        photoPath,
        loading: false,
      }),
    );
    const formData = new FormData();
    formData.append('formNames', 'avatar');
    formData.append('avatar', file);
    onUpload(formData);

    return false;
  };

  render() {
    const { children, form, record } = this.props;
    const { visible, photoPath, loading } = this.state;
    const { getFieldDecorator } = form;
    const {
      userName = '',
      userRealName = '',
      userPhone = '',
      userSex = '0',
      userAge = '',
      userEmail = '',
    } = record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title={`${record.userId ? '修改' : '添加'}用户`}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form {...formItemLayout} horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="用户名" hasFeedback>
              {getFieldDecorator('userName', {
                initialValue: userName,
                rules: [{ required: true, message: '请输入用户名' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="真实姓名" hasFeedback>
              {getFieldDecorator('userRealName', {
                initialValue: userRealName,
                rules: [{ required: true, message: '请输入真实姓名' }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="手机号" hasFeedback>
              {getFieldDecorator('userPhone', {
                initialValue: userPhone,
              })(<Input/>)}
            </FormItem>
            <FormItem label="邮箱" hasFeedback>
              {getFieldDecorator('userEmail', {
                initialValue: userEmail,
              })(<Input/>)}
            </FormItem>
            <FormItem label="密码" hasFeedback>
              {getFieldDecorator('userPwd', {
                initialValue: '',
                rules: [{ required: !record.userId, message: '请输入密码' }],
              })(<Input.Password/>)}
            </FormItem>
            <Form.Item label="性别">
              {getFieldDecorator('userSex', {
                initialValue: userSex,
              })(
                <Radio.Group>
                  <Radio value="0">男</Radio>
                  <Radio value="1">女</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <FormItem label="年龄" hasFeedback>
              {getFieldDecorator('userAge', {
                initialValue: userAge,
                rules: [{ pattern: pattern.number.pattern, message: pattern.number.message }],
              })(<Input/>)}
            </FormItem>
            <FormItem label="头像">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
              >
                {photoPath ? <img className={styles.avatar} src={photoPath} alt="avatar"/> : uploadButton}
              </Upload>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserModal);
