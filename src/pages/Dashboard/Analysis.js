import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const DownLoadCard = React.lazy(() => import('./DownloadCard'));

@connect(({ dashboard, loading }) => ({
  dashboard,
  loading: loading.effects['dashboard/fetch'],
}))
class Analysis extends Component {
  state = {
    rangePickerValue: getTimeDistance('week'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboard/fetch',
      });
      dispatch({
        type: 'dashboard/fetchChart',
        payload: 'week',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }


  handleRangePickerChange = rangePickerValue => {
    if (rangePickerValue.length > 0) {
      const { dispatch } = this.props;

      this.setState({
        rangePickerValue,
      });

      dispatch({
        type: 'dashboard/queryChartByTime',
        payload: {
          beginDate: rangePickerValue[0].format('YYYY-MM-DD'),
          endDate: rangePickerValue[1].format('YYYY-MM-DD'),
        },
      });
    }
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'dashboard/fetchChart',
      payload: type,
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue } = this.state;
    const { dashboard } = this.props;
    const {
      logData,
      noticeData,
      feedbackData,
      serviceData,
      chartData,
      listData,
      downloadData,
      useData,
    } = dashboard;

    const props = {
      logData,
      noticeData,
      feedbackData,
      serviceData,
    };
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow {...props} />
        </Suspense>
        <Suspense fallback={null}>
          <DownLoadCard
            downloadData={downloadData}
            useData={useData}
          />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            chartData={chartData}
            listData={listData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            selectDate={this.selectDate}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;
