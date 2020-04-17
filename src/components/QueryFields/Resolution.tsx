import React from 'react';
import { FormField, Select } from '@grafana/ui';

import { QueryRow } from '../shared';
/* 
  TODO: WIP
*/

const options = [
  {
    value: '1s',
    label: "1s"
  },
  {
    value: '2s',
    label: "2s"
  },
  {
    value: '3s',
    label: "3s"
  },
  {
    value: '4s',
    label: '4s'
  },
  {
    value: '1m',
    label: '4m'
  },
];

export const Resolution = ({ label, value, onChange }) => {
  const SelectResolution = () => {
    return <Select placeholder={value} defaultValue="1m" options={options} value={value} onChange={onChange} />
  }
  return (
    <QueryRow>
      <FormField labelWidth={8} className="query-keyword" label={label} inputEl={<SelectResolution />} />
    </QueryRow>
  )
}