import React, { PureComponent } from 'react';
import { Icon, Modal, Input, Form } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import md5 from 'md5';

const FormItem = Form.Item;
@connect(({ global, loading }) => ({
  global,
  confirmLoading: loading.effects['global/editorPass'],
}))
@Form.create()

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  okHandler = () => {
    const { form, dispatch } = this.props;
    const userId = localStorage.getItem('userId');
    form.validateFields((err, values) => {
      const { userPwd, oldPwd } = values;
      if (!err) {
        const res = {
          userId,
          oldPwd: md5(oldPwd),
          userPwd: md5(userPwd),
        };
        dispatch({
          type: 'global/editorPass',
          payload: res,
        });
        form.resetFields();
      }
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/save',
      payload: {
        pwdVisble: false,
      },
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('userPwd')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  };

  render() {
    const { collapsed, isMobile, logo, global: { pwdVisble }, confirmLoading, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <RightContent {...this.props} />
        <Modal
          title="修改密码"
          visible={pwdVisble}
          onOk={this.okHandler}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout} horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="原密码" hasFeedback>
              {getFieldDecorator('oldPwd', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input.Password />)}
            </FormItem>
            <FormItem label="新密码" hasFeedback>
              {getFieldDecorator('userPwd', {
                rules: [
                  { required: true, message: '请输入密码' },
                  {
                    pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!#@*&.])[a-zA-Z\d!#@*&.]*$/,
                    message: '密码必须包含大小写字母、数字和特殊字符',
                  },
                  { min: 8, message: '密码最少8个字符' },
                  {max: 16, message: '密码最长16个字符'}
                ],
              })(<Input.Password />)}
            </FormItem>
            <FormItem label="确认密码" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '2次密码不一致!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
