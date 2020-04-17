import React from 'react';
import { FormLabel } from '@grafana/ui';

import { QueryRow } from '../shared';

/* 
  TODO: WIP
*/

export const Aggregations = ({ label }) => {
  return (
    <QueryRow>
      <div className="gf-form">
        <FormLabel width={8} className="query-keyword">
          <span>{label}</span>
        </FormLabel>
      </div>
    </QueryRow>)
}