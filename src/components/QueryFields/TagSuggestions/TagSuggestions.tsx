import React, { useState } from 'react';
import { FormLabel, Select } from '@grafana/ui';
import { QueryRow } from '../../shared';
import { useTagKeyCountSuggestions, useCurrentFilter } from '../../../hooks';

/* 
  TODO: Implement adhoc and global variables.
*/

const mapSuggestionsToOptions = suggestions => suggestions.map(({ key, count }) => ({ label: key, description: `${count} tags available`, value: key }));

export const TagSuggestions = ({ label }) => {
  const [loading, suggestions] = useTagKeyCountSuggestions(mapSuggestionsToOptions);
  const [, dispatch] = useCurrentFilter();
  const [value, setValue] = useState(null);

  const onChange = ({ value }) => {
    dispatch({ type: 'key-select', payload: value })
    setValue(null);
  }

  return (
    <QueryRow>
      <div className="gf-form">
        <FormLabel width={10} className="query-keyword">
          <span>{label}</span>
        </FormLabel>
        <div className="width-20">
          <Select
            options={loading ? [] : suggestions}
            isLoading={loading}
            noOptionsMessage={() => 'No options found. Try again.'}
            value={(value || {})}
            allowCustomValue={true}
            onChange={onChange} />
        </div>
      </div>
    </QueryRow>
  );
}