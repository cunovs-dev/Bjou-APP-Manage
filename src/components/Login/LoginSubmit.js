import React from 'react';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary"
              style={{ background: '#054a97', borderColor: '#054a97' }}
              htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
