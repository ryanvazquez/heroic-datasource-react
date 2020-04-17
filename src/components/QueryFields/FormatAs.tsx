import React from 'react';
import { FormField, Select } from '@grafana/ui';

import { QueryRow } from '../shared';

/* 
  TODO: WIP
*/

const options = [
  {
    value: 'time-series',
    label: "Time Series"
  },
  {
    value: 'table',
    label: "Table"
  },
];

export const FormatAs = ({ label, onChange, value }) => {
  const SelectFormat = () => {
    return (
      <Select placeholder="Time Series" defaultValue="time-series" options={options} value={value} onChange={onChange} />
    )
  }

  return (
    <QueryRow>
      <FormField className="query-keyword" label={label} labelWidth={8} inputEl={<SelectFormat />} />
    </QueryRow>
  )
}