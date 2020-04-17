import React from 'react';
import { QueryField, FormLabel } from '@grafana/ui';

import { QueryRow } from '../shared';

/* 
  TODO: WIP. Most likely will not use QueryField. Placeholder for now.
*/

export const AliasBy = ({ label }) => {
  return (
    <QueryRow>
      <FormLabel width={8} className="query-keyword">
        <span>{label}</span>
      </FormLabel>
      <div className="width-20">
        <QueryField query="some alias" portalOrigin="alias-by" />
      </div>
    </QueryRow>
  )
}