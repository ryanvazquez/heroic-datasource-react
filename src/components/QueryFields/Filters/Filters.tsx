import React from 'react';
import { uniqBy } from 'lodash';

import { FormLabel, Spinner } from '@grafana/ui';
import { FilterExpression } from './FilterExpression';
import { QueryRow } from '../../shared';
import { useCurrentFilter, useTagSuggestions } from '../../../hooks';

const areTagsEqual = (prevProps, nextProps) => prevProps.tags === nextProps.tags;

export const Filters = React.memo(function ({
  label,
  tags,
  onChange,
  variables
}) {
  const [current, dispatch] = useCurrentFilter();
  const [loading, tagSuggestions] = useTagSuggestions({
    key: current.key,
    value: current.value
  }, (suggestions) => {
    if (!current.key) {
      const uniques = uniqBy(suggestions, (suggest) => suggest.key);
      return uniques.map(({ key }) => ({ value: key, label: key }));
    } else {
      return suggestions.map(({ key, value }) => {
        if (!value) {
          return ({ value: key, label: key });
        }
        return ({ value, label: value });
      });
    }
  });

  React.useEffect(() => {
    // if the user has selected a value, the expression is complete.
    // update the query filters and reset the current filter state.
    if (current.value) {
      onChange({ type: 'add-tag', payload: current });
      dispatch({ type: 'reset' });
    }
  }, [current]);

  const checkIfTagsContainKeys = () => {
    return tags.filter(tag => tag.key === '$key').length > 0;
  }

  const checkIfKeyHasBeenSet = () => !!current.key;
  const checkIfTagsExist = () => !!tags.length;

  const renderTooltip = () => {
    const suggestions = [];

    const tagsOverriddenByGlobalFilters = tags
      .filter(tag => tag.key === 'env' && tag.operator === '=')
      .map(({ key, operator, value }) => <span>{`${key} ${operator} ${value} is being overridden by a global filter.`}</span>);

    if (tagsOverriddenByGlobalFilters.length) {
      suggestions = suggestions.concat(tagsOverriddenByGlobalFilters);
    }

    if (tags.length && !checkIfTagsContainKeys()) {
      suggestions.push(<span>Try adding a $key filter to improve search results</span>);
    }

    if (suggestions.length) {
      return ({
        tooltip: (
          <div>
            <i style={{ padding: '0 .5em', color: 'white', cursor: 'pointer' }} className="fa fa-info" />
            {suggestions}
          </div>
        )
      })
    }

    return {}
  }

  return (
    <QueryRow>
      <div className="gf-form">
        <FormLabel className="query-keyword" width={7} {...renderTooltip()}>
          <span>{label}</span>
        </FormLabel>
        {tags.map((tag, index) => (
          <FilterExpression
            tag={tag}
            editMode={false}
            options={tagSuggestions}
            variables={[]}
            onChange={onChange}
            displayAnd={(index > 0)}
            displaySegments={true} />
        ))}
        {loading
          ? <div className="gf-form-label"><Spinner /></div>
          : <FilterExpression
            tag={current}
            editMode={true}
            options={tagSuggestions}
            variables={[]}
            onChange={dispatch}
            displayAnd={checkIfTagsExist()}
            displaySegments={checkIfKeyHasBeenSet()} />}
      </div>
    </QueryRow>
  );
}, areTagsEqual);