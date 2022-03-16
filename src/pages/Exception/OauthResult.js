import React from 'react';
import Exception from '@/components/Exception';

const OauthResult = () => (
  <Exception
    type="403"
    title={'需授权访问'}
    desc={'抱歉，您暂时没有权访问该系统。'}
    actions={'需要访问，请联系管理员授权。'}
  />
);

export default OauthResult;
