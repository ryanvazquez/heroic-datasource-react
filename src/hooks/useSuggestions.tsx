import React, { createContext } from 'react';
import { useAsync } from 'react-use';

const MetadataStateContext = createContext(undefined);
const MetadataDispatchContext = createContext(undefined);

/* 
  TODO: Ensure correctness of metadata requests.
  TODO: Template variable replacement. Could be done here or in the Metadata client by the datasource.
*/

export const MetadataProvider = ({ metadata, tags, children }) => {
  return (
    <MetadataStateContext.Provider value={tags}>
      <MetadataDispatchContext.Provider value={metadata}>
        {children}
      </MetadataDispatchContext.Provider>
    </MetadataStateContext.Provider>
  );
};

export const useTagSuggestions = ({ key, value }, callback) => {
  const tags = React.useContext(MetadataStateContext);
  const { tagSuggest, keySuggest } = React.useContext(MetadataDispatchContext);

  const state = useAsync(async () => {
    const filtersWithValues = tags
      .filter(tag => tag.value)
      .map(({ operator, key, value }) => {
        if (key === '$key') return ['key', value];
        else return [operator, key, value]
      });
    const filter = (filtersWithValues.length ? ["and", ...filtersWithValues] : ["true"]);

    let metadata;
    let getSuggestion;

    if (key === '$key') {
      metadata = { key: '', filter };
      getSuggestion = keySuggest;
    } else {
      metadata = key ? { key, value, filter } : { key, filter };
      getSuggestion = tagSuggest;
    }

    const { data } = await getSuggestion(metadata);

    return callback ? callback(data.suggestions) : data.suggestions;
  }, [key, value, tags]);

  return [state.loading, state.value, state.error];
}

export const useTagKeyCountSuggestions = (callback) => {
  const tags = React.useContext(MetadataStateContext);
  const { tagKeyCount } = React.useContext(MetadataDispatchContext);

  const state = useAsync(async () => {
    const filtersWithValues = tags
      .filter(tag => tag.value)
      .map(({ operator, key, value }) => {
        if (key === '$key') return ['key', value];
        else return [operator, key, value]
      });

    const metadata = { filter: (filtersWithValues.length ? ["and", ...filtersWithValues] : ["true"]) };

    const { data } = await tagKeyCount(metadata);

    return callback ? callback(data.suggestions) : data.suggestions;
  }, [tags]);

  return [state.loading, state.value, state.error];
}

export const useParser = (filter) => {
  const { parseFilters } = React.useContext(MetadataDispatchContext);

  const state = useAsync(async () => {
    const { data } = await parseFilters(filter);
    return data;
  }, [filter]);

  return [state.loading, state.value, state.error];
}