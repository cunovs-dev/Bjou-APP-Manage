import React, { Component } from 'react';
import { Button, Form, Row, Col, Select } from 'antd';
import styles from '@/global.less';

const FormItem = Form.Item;
const state = [
  { label: '运行日志', value: 10 },
  { label: '任务日志', value: 20 },
  { label: '调试日志', value: 30 },
  { label: '系统错误日志', value: 40 },
  { label: '后台访问日志', value: 50 },
  { label: '后台操作日志', value: 60 },
];

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };

  handleSearch = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
      }
    });
  };

  render() {
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="日志类型">
              {getFieldDecorator('logType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {state.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Modals);
