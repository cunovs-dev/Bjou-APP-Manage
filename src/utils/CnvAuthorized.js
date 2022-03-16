import { connect } from 'dva';

const CnvAuthorized = ({ target }) => {
  return target;
};

export default connect(({ global: { authorized }, loading }) => ({
  authorized,
  loading: loading.global.fetchAuth,
}))(CnvAuthorized);
