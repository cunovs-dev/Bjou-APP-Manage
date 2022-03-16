import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Link from 'umi/link';
import styles from './Analysis.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const getTodayLog = arr => arr && arr[arr.length - 1].count;

const IntroduceRow = memo(({ logData = {}, noticeData = {}, feedbackData = {}, serviceData = {} }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={JSON.stringify(logData)==="{}"}
        title='访问量统计'
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce"/>}
          >
            <Icon type="info-circle-o"/>
          </Tooltip>
        }
        total={numeral(logData.total).format('0,0')}
        footer={
          <Field
            label='日访问量'
            value={numeral(getTodayLog(logData.chartData)).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={logData.chartData}/>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={JSON.stringify(feedbackData)==="{}"}
        title='反馈数'
        action={
          <Tooltip
            title='123'
          >
            <Icon type="info-circle-o"/>
          </Tooltip>
        }
        total={numeral(feedbackData.total).format('0,0')}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Field
              label='回复'
              value={feedbackData.replyTotal}
            />
            <Field
              label='回复率'
              value={`${feedbackData.replyRatio}%`}
            />
          </div>
        }
        contentHeight={46}
      >
        <MiniBar data={feedbackData.chartData}/>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='通知公告'
        action={
          <Tooltip
            title='总个数'
          >
            <Icon type="info-circle-o"/>
          </Tooltip>
        }
        loading={JSON.stringify(noticeData)==="{}"}
        total={noticeData.total}
        footer={
          <Link to='/notification/basic'>
            详情
          </Link>
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          已发布
          <span className={styles.trendText}>{noticeData.published}</span>
        </Trend>
        <Trend flag="down">
          未发布
          <span className={styles.trendText}>{noticeData.unpublished}</span>
        </Trend>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={JSON.stringify(serviceData)==="{}"}
        bordered={false}
        title='服务状态'
        action={
          <Tooltip
            title='23'
          >
            <Icon type="info-circle-o"/>
          </Tooltip>
        }
        total={`${serviceData.replyRatio}%`}
        footer={
          <Link to='/service/basic'>
            详情
          </Link>
        }
        contentHeight={46}
      >
        <MiniProgress
          percent={parseInt(serviceData.replyRatio, 10)}
          strokeWidth={8}
          target={parseInt(serviceData.replyRatio, 10)}
          targetLabel={`成功率：${serviceData.replyRatio}%`}
          color="#13C2C2"
        />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
