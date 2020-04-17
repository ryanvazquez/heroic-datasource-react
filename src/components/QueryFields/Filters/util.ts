import { uniqBy } from 'lodash';

export const mapTagSuggestionsToSelectableValues = ({ tags: { suggestions } }) => {
  const uniques = uniqBy(suggestions, (suggest) => suggest.key);
  return uniques.map(({ key }) => ({ value: key, label: key }));
}

export const defaultOptions = [
  {
    label: '$key',
    value: '$key'
  }
];

export const operators = [
  {
    label: '=',
    value: 'MATCHES'
  },
  {
    label: '!=',
    value: 'DOES_NOT_MATCH'
  },
  {
    label: '^',
    value: 'PREFIXED_WITH'
  },
  {
    label: '!^',
    value: 'NOT_PREFIXED_WITH'
  },
  {
    label: '~',
    value: 'REGEX_MATCH'
  },
];