// external dependencies
import React from 'react';
import { defaultsDeep } from 'lodash';

// grafana dependencies
import { QueryEditorProps } from '@grafana/data';

// internal dependencies
import { HeroicDatasource } from '../datasource';
import { CurrentFilterProvider, MetadataProvider } from '../hooks';
import * as Fields from './QueryFields';

//types
import { HeroicQuery, HeroicOptions, defaultQuery } from '../types';

type Props = QueryEditorProps<HeroicDatasource, HeroicQuery, HeroicOptions>

const {
  TagSuggestions,
  Filters,
  ComplexFilters,
  Aggregations,
  Resolution,
  FormatAs,
  AliasBy,
  GlobalAggregations,
} = Fields;

/* 
  Avoids internal state. Query state is controlled by Grafana and derived from query props.
*/

class QueryEditor extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  get metadata() {
    return this.props.datasource.metadata;
  }

  get heroic() {
    return this.props.datasource.heroic;
  }

  /* 
    For each target, Grafana creates a new instance of the query editor
    and the instance renders three times.

    The first render calls normal React lifecycle methods, whereas
    second and third renders don't - despite no changes to query state.

    Whenever a query's filters change, tagKeyCount updates based on current filters.
    Additional renders will cause uncessary API calls, so shouldComponentUpdate bails out
    of a render if a query does not change.
  */

  shouldComponentUpdate(nextProps) {
    return this.props.query !== nextProps.query;
  }

  // Updates query state
  onChange = (state) => {
    const { query } = this.props;
    if (typeof state === 'function') {
      const callback = state;
      this.props.onChange(callback(query));
    } else {
      this.props.onChange({ ...query, ...state });
    }
  }

  // Executes Query
  onRunQuery = () => {
    this.props.onRunQuery();
  }

  setQueryState = (state) => {
    this.onChange(state);
  }

  setQueryStateAndRun = (state) => {
    this.onChange(state);
    this.onRunQuery();
  }

  onResolutionSelect = (resolution) => {
    this.setQueryState({ resolution });
  }

  onGlobalAggregationSelect = () => {
    this.setQueryState(prevState => ({
      ...prevState,
      globalAggregation: !prevState.globalAggregation
    }));
  }

  onFormatSelect = (resultFormat) => {
    this.setQueryState({ resultFormat });
  }

  onAliasChange = (alias) => {
    this.setQueryState({ alias });
  }

  onResolutionChange = (resolution) => {
    this.setQueryState({ resolution });
  }

  addTag = tag => {
    this.setQueryState(prevState => {
      return ({ ...prevState, tags: prevState.tags.concat([tag]) });
    });
  }

  removeTag = tag => {
    this.setQueryState(prevState => {
      return ({ ...prevState, tags: prevState.tags.filter(prev => prev !== tag) });
    });
  }

  updateTag = (prevTag, nextTag) => {
    this.setQueryState(prevState => {
      const tags = prevState.tags.map(tag => {
        return tag === prevTag ? nextTag : tag
      });
      return ({ ...prevState, tags });
    });
  }

  onFilterChange = ({ type, payload = {}, meta = {} }) => {
    const { tag } = meta;
    switch (type) {
      // filter actions
      case 'add-tag': {
        this.addTag(payload);
        break;
      }
      case 'remove-filter': {
        this.removeTag(tag);
        break;
      }
      case 'key-select': {
        this.updateTag(tag, { ...tag, key: payload });
        break;
      }
      case 'operator-select': {
        this.updateTag(tag, { ...tag, operator: payload });
        break;
      }
      case 'value-select': {
        this.updateTag(tag, { ...tag, value: payload });
        break;
      }
      // complex filter actions
      case 'add-complex-filter': {
        const complexFilter = { key: 'q', operator: '=', value: payload, condition: 'AND' };
        this.addTag(complexFilter);
        break;
      }
      case 'remove-complex-filter': {
        this.removeTag(tag);
        break;
      }
      case 'update-complex-filter': {
        this.updateTag(tag, { ...tag, value: payload });
        break;
      }
      default: {
        throw new Error(`Expected valid event type. Received: ${event}`);
      }
    }
  }

  onAggregationChange = ({ type, payload = {}, meta = {} }) => {
    switch (type) {
      default: {
        throw new Error(`Expected valid event type. Received: ${event}`);
      }
    }
  }

  /* 
    Since a query is derived from props, there is no way for the Editor
    to set a default state, except by 
  */

  getQueryFromProps = () => {
    const query = defaultsDeep(this.props.query, defaultQuery);
    return ({
      ...query,
      tags: query.tags.filter(tag => tag.key !== 'q'),
      complexFilters: query.tags.filter(tag => tag.key === 'q')
    });
  }

  render() {
    const {
      tags,
      select,
      resolution,
      resultFormat,
      alias,
      groupBy,
      globalAggregation,
      complexFilters // complexFilters are derived from tags
    } = this.getQueryFromProps();

    const {
      onGlobalAggregationSelect,
      onFormatSelect,
      onAliasChange,
      onResolutionChange,
      onFilterChange,
    } = this;

    return (
      <>
        <MetadataProvider metadata={this.metadata} tags={tags}>
          <CurrentFilterProvider>
            <TagSuggestions
              label={"TAG SUGGESTIONS"} />
            <Filters
              label={'WHERE'}
              tags={tags}
              onChange={onFilterChange} />
          </CurrentFilterProvider>
          <ComplexFilters
            label={"COMPLEX FILTERS"}
            filters={complexFilters}
            onChange={onFilterChange} />
        </MetadataProvider>
        <Aggregations
          label={'AGGREGATIONS'} />
        <Resolution
          label={"RESOLUTION"}
          value={resolution}
          onChange={onResolutionChange} />
        <FormatAs
          label={'FORMAT AS'}
          value={resultFormat}
          onChange={onFormatSelect} />
        <AliasBy label={'ALIAS BY'} />
        <GlobalAggregations
          label={'GLOBAL AGGREGATIONS'}
          checked={globalAggregation}
          onChange={onGlobalAggregationSelect} />
      </>
    )
  }
}

export const HeroicQueryEditor = React.memo(QueryEditor);
