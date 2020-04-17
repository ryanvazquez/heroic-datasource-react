import { uniqBy } from 'lodash';
import { TagOperators } from '../types';

export const transform = (...fns) => ({ data: { suggestions } }) => fns.reduce((v, f) => f(v), suggestions);

export const isKey = key => {
  return key === '$key';
}

export const createTag = ({ key = '', operator = '=', value = '' }) => [operator, key, value];

export const tagsContainKey = tags => {
  for (const { key } of tags) {
    if (isKey(key)) return true;
  }
  return false;
}

export const createFilter = ({ key, tags, type = 'tags' }) => {
  let keyRequestWithoutTags = false;
  let keyRequestWithTags = false;
  let tagRequestWithKey = false;
  let tagRequestWithoutKey = false;

  if (type === 'key') {
    if (!key && tags.length) {
      keyRequestWithTags = true;
    } else {
      keyRequestWithoutTags = true;
    }
  }

  if (type === 'tags') {
    if (!key && tags.length) {
      tagRequestWithoutKey = true;
    } else {
      tagRequestWithoutKey = true;
    }
  }

  if (tagRequestWithoutKey || keyRequestWithoutTags) {
    return ({
      key: '',
      filter: ["true"]
    });
  }

  if (tagRequestWithKey || keyRequestWithTags) {
    return ({
      key,
      filter: tags
    });
  }
}

export const transformValuesToCompletionItems = (key, values) => {
  return values.map(value => ({ label: `${key}::${value}` }));
}

export const transformToTypeaheadOutput = (suggestions) => {
  const { keys, allKeys } = suggestions.reduce((all, suggestion) => {
    const { key, value } = suggestion;
    return ({
      ...all,
      keys: {
        ...all.keys,
        [key]: [...(all.keys[key] || []), value]
      },
      allKeys: [...all.allKeys, ...(key in all.keys ? [] : [key])]
    });
  }, { keys: {}, allKeys: [] });

  const completionItemGroup = allKeys.map(key => ({
    label: key,
    items: transformValuesToCompletionItems(key, keys[key])
  }));

  return ({ suggestions: completionItemGroup });
}

export const transformKeySuggestionsToTypeaheadOutput = ({ data: { suggestions } }) => {
  return transformToTypeaheadOutput(suggestions.map(({ key }) => ({ key: '$key', value: key })));
}

export const transformTagSuggestionsToTypeaheadOutput = ({ data: { suggestions } }) => {
  return transformToTypeaheadOutput(suggestions);
}

export const keySuggestionsToSelectableValues = suggestions => {
  return suggestions.map(({ key }) => ({ value: key, label: key }));
}

export const tagSuggestionsToSelectableValues = suggestions => {
  const uniques = uniqBy(suggestions, (suggest) => suggest.key);
  return uniques.map(({ key }) => ({ value: key, label: key }));
}

export const metricsToSelectableValues = metrics => {
  return metrics.map(({ value }) => ({ value, label: value }));
}

export const prepend = (options) => suggestions => {
  return [...options, ...suggestions];
}

export const renderFilter = (tag, options = { operator: '=', isKey: false }) => {
  if (tag.type) { return ['q', tag.key]; }
  const [, key, value] = tag;

  switch (operator) {
    case '=': {
      return options.isKey ? ['key', value] : ['=', key, value];
    }
    case '!=': {
      return options.isKey ? ["not", ['key', value]] : ["not", ['=', key, value]];
    }
    case '^': {
      return options.isKey ? ['^', 'key', value] : ['^', key, value];
    }
    case '!^': {
      return options.isKey ? ["not", ['^', 'key', value]] : ["not", ['^', key, value]];
    }
    default: {
      throw new TypeError(`Unrecognized operator. Received ${operator}`);
    }
  }
}