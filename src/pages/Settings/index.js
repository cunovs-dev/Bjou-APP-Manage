import React, { PureComponent } from 'react';
import { Card, Form, Input, Button, Upload, Icon, message } from 'antd';
import md5 from 'md5';
import { connect } from 'dva';
import { pattern } from '@/utils/utils';
import styles from './index.less';

const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const namespace = 'setting';

@connect(({ user, loading }) => ({
  user,
  treeLoading: loading.effects[`${namespace}/fetchDept`],
  userLoading: loading.effects[`${namespace}/queryUser`],
  adding: loading.global,
}))

class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      photoPath: '',
    };
  }

  componentDidMount() {
    this.setState((state, props) => (
      { photoPath: props.user.currentUser.photoPath }
    ));
  }


  settingsClick = () => {
    const { form, dispatch, user: { photoPath } } = this.props;
    form.validateFields((err, values) => {
      const { oldPwd, userPwd } = values;
      if (!err) {
        const res = {
          ...values,
          photoPath,
          oldPwd: oldPwd ? md5(oldPwd) : oldPwd,
          userPwd: userPwd ? md5(userPwd) : userPwd,
        };
        dispatch({
          type: 'user/settings',
          payload: res,
        });
      }
    });
  };

  handlerUpload = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: `user/uploadAvatar`,
      payload: value,
    });
  };


  beforeUpload = (file) => {
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
    this.handlerUpload(formData);
    return false;
  };

  render() {
    const { form, user: { currentUser } } = this.props;
    const { loading, photoPath = '' } = this.state;
    const { getFieldDecorator } = form;
    const {
      userRealName = '',
      userPhone = '',
      userAge = '',
      userEmail = '',
    } = currentUser;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 4 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Card title="个人设置">
        <Form {...formItemLayout} horizontal="true" onSubmit={this.okHandler}>
          <FormItem label="真实姓名" hasFeedback>
            {getFieldDecorator('userRealName', {
              initialValue: userRealName,
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
          <FormItem {...tailFormItemLayout}>
            <Button onClick={this.settingsClick} type="primary">更改个人信息</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Settings);
