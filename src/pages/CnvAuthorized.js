import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Exception403 from '@/pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import { oauthLoginUrl } from '../utils/utils';

function CnvAuthComponent({ children, location, userAuthorized, loading }) {
  const { pathname } = location;
  const authorizedKeys = Object.keys(userAuthorized);

  const isLogin = userAuthorized['/'] === true;
  const hasAuth = () => {
    let authorities;
    authorizedKeys.forEach(pathKey => {
      // match prefix
      if (pathToRegexp(`${pathKey}(.*)`).test(pathname)) {
        authorities = userAuthorized[pathKey] || authorities;
      }
    });
    return authorities;
  };

  console.log(JSON.stringify(userAuthorized), loading);

  if (!loading && !isLogin){
    if(oauthLoginUrl !== ''){
      window.location.replace(oauthLoginUrl);
    } else
      return <Redirect to="/user/login"/>;

  }


  return (
    // isLogin ? hasAuth() ? <div>{children}</div> : <Exception403/> : loading === false ? <Redirect to="/user/login"/> :
    //   <PageLoading/>
    // <div>{children}</div>
    loading === false && isLogin ? <div>{children}</div> : <PageLoading/>
  );
}

export default connect(({ global, loading }) => ({
  userAuthorized: global.authorized,
  loading: loading.effects['global/fetchUserAuth'],
}))(CnvAuthComponent);
