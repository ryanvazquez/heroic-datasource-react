import React from 'react';
import { Switch } from '@grafana/ui';

import { QueryRow } from '../shared';

export const GlobalAggregations = ({ label, checked, onChange }) => {
  return (
    <QueryRow>
      <Switch className="query-keyword" label={label} checked={checked} onChange={onChange} />
    </QueryRow>
  )
};