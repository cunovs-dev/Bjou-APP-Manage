import React, { memo } from 'react';
import { Row, Col, Card, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = memo(
  ({ rangePickerValue, chartData, listData, isActive, handleRangePickerChange, loading, selectDate }) => (
    <Card
      title="APP访问量"
      loading={loading}
      bordered={false}
      bodyStyle={{ padding: 0 }}
      extra={<div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={isActive('week')} onClick={() => selectDate('week')}>
            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week"/>
          </a>
          <a className={isActive('month')} onClick={() => selectDate('month')}>
            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month"/>
          </a>
          <a className={isActive('year')} onClick={() => selectDate('year')}>
            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year"/>
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>}
    >
      <div className={styles.salesCard}>
        <Row>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.salesBar}>
              <Bar
                height={400}
                title='访问量统计'
                data={chartData}
              />
            </div>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
               服务访问
              </h4>
              <ul className={styles.rankingList}>
                {listData&&listData.map((item, i) => (
                  <li key={i}>
                    <span
                      className={`${styles.rankingItemNumber}`}
                    >
                      {i + 1}
                    </span>
                    <span className={styles.rankingItemTitle} title={item.service_name}>
                      {item.service_name}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.service_count).format('0,0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  ),
);

export default SalesCard;
