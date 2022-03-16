import React, { memo } from 'react';
import { Row, Col, Card } from 'antd';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';


const DownLoadCard = memo(
  ({ downloadData = {}, useData = {} }) => (
    <Row gutter={24} type='flex' justify='space-between'>
      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
        <Card
          title={`APP下载次数 (总数:${downloadData.count||0}次)`}
          loading={JSON.stringify(downloadData)==="{}"}
          bordered={false}
          bodyStyle={{ padding: 0, marginBottom: '30px' }}
        >
          <div className={styles.salesCard}>
            <div className={styles.salesBar}>
              <Bar
                height={400}
                data={downloadData.statisticsData}
              />
            </div>
          </div>
        </Card>
      </Col>
      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
        <Card
          title={`APP使用情况 (总数:${useData.count||0}人)`}
          loading={JSON.stringify(useData)==="{}"}
          bordered={false}
          bodyStyle={{ padding: 0, marginBottom: '30px' }}
        >
          <div className={styles.salesCard}>

            <div className={styles.salesBar}>
              <Bar
                height={400}
                data={useData.statisticsData}
              />

            </div>
          </div>
        </Card>
      </Col>
    </Row>
  ),
);

export default DownLoadCard;
