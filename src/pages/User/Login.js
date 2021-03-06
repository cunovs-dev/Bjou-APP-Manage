import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {  Alert, message, } from 'antd';
import md5 from 'md5';
import { JSEncrypt } from 'jsencrypt';
import Login from '@/components/Login';
import styles from './Login.less';

const encrypt = new JSEncrypt();
encrypt.setPublicKey('MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALB+bLq7pd7OBrkd2LfDYw5fOkmjjeY0jq/+eNf1FuHQJtHoJmZIgZWZfNQKAHtWfNQlwag4pvr8P7zdj8u0D3sCAwEAAQ==');
const { UserName, Password,Submit , CaptchaImg} = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  refreshCode=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'login/queryVerify'
    })
  }

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
          message.warning(formatMessage({ id: 'app.login.verification-code-warning' }));
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      const { password } = values;
      const res = {
        ...values,
        password: encrypt.encrypt(md5(password)),
      };
      dispatch({
        type: 'login/login',
        payload: {
          ...res,
          type,
        },
      });
    }
  };


  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state , {captchaImageData} = login;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >

            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}: ????????????????????????`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}: ?????????????????????`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            {captchaImageData !== '' ? <CaptchaImg
              name="code"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
              onRefreshCaptcha={this.refreshCode}
              getCaptchaImageSrc={login.captchaImageData}
            /> : null}
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>

        </Login>
      </div>
    );
  }
}

export default LoginPage;
