import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import Exception from '@/components/Exception';

export default () => (
  <Exception
    type="404"
    desc={formatMessage({ id: 'app.exception.description.404' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);
