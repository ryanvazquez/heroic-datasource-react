// external dependencies
import React from 'react';
import { defaultsDeep } from 'lodash';

// grafana dependencies
import { FormField, TagsInput, Button, DataSourceHttpSettings, Icon } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';

import { createSuggestionRule, buildEventFactory } from './util';
import { HeroicOptions } from '../types';

export const defaultJsonData = {
  defaultUrl: 'http://localhost:8086',
  alertingUrl: '',
  showAccessOptions: true,
  tagCollapseChecks: [],
  tagAggregationChecks: [],
  suggestionRules: []
};

/* 
  WIP
  TODO: Can the QueryFields be passed here? Inputing raw JSON as field data isn't very user friendly.
*/

export const HeroicConfigEditor = (props: DataSourcePluginOptionsEditorProps<HeroicOptions>) => {
  const { onOptionsChange } = props;
  const options = {
    ...props.options,
    jsonData: defaultsDeep({}, props.options.jsonData, defaultJsonData)
  };
  const { jsonData } = options;

  const { tagAggregationChecks, alertingUrl, tagCollapseChecks, suggestionRules, defaultUrl, showAccessOptions } = jsonData;

  const setConfig = (config) => onOptionsChange({ ...options, ...config });

  const addQuerySuggestionRule = (e: React.SyntheticEvent) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        suggestionRules: [createSuggestionRule(), ...options.jsonData.suggestionRules]
      }
    });
  };

  const setAlertingUrl = (e: React.SyntheticEvent) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        alertingUrl: e.target.value
      }
    });
  };

  const addTagAggregationChecks = (tags: string[]) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        tagAggregationChecks: [...options.jsonData.tagAggregationChecks, ...tags]
      }
    });
  };

  const addCollapseChecks = (tags: string[]) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        tagAggregationChecks: [...options.jsonData.tagCollapseChecks, ...tags]
      }
    });
  };

  const removeRule = id => () => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        suggestionRules: options.jsonData.suggestionRules.filter(rule => rule.id !== id)
      }
    });
  };

  const eventFactory = buildEventFactory({ options, onOptionsChange });

  const onDescriptionChange = eventFactory(({ suggestion, event }) => ({ ...suggestion, description: event.target.value }));
  const onTriggerFilterChange = eventFactory(({ suggestion, event }) => ({ ...suggestion, triggerFilter: event.target.value }));
  const onFilterChange = eventFactory(({ suggestion, event }) => ({ ...suggestion, filter: event.target.value }));
  const onAggregationChange = eventFactory(({ suggestion, event }) => ({ ...suggestion, aggregation: event.target.value }));

  return (
    <>
      <DataSourceHttpSettings
        defaultUrl={defaultUrl}
        showAccessOptions={showAccessOptions}
        dataSourceConfig={options}
        onChange={setConfig} />
      <h3 className="page-heading">Additional Details</h3>
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <FormField
            onChange={setAlertingUrl}
            type="text"
            value={alertingUrl}
            inputWidth={16}
            label={"Alerting URL"}
            labelWidth={12}
            tooltip={'An alternate URL to hit for alerting. If no alternate is required, set to the same value as URL.'} />
        </div>
        <div className="gf-form-inline">
          <FormField
            label="Should Not Aggregate"
            labelWidth={12}
            tooltip="A list of tag keys which should not be collapsed and should be warned about.
            For example, if 'stat' is entered, Grafana will display a warning message when it receives
            results which have multiple values for 'stat' collapsed into one series."
            inputWidth={16}
            inputEl={
              <TagsInput
                width={16}
                tags={tagAggregationChecks}
                onChange={addTagAggregationChecks} />}
          />
        </div>
        <div className="gf-form-inline">
          <FormField
            label="Should Not Collapse"
            labelWidth={12}
            tooltip="A list of tag keys which should not be collapsed and should be warned about.
            For example, if 'stat' is entered, Grafana will display a warning message when it receives
            results which have multiple values for 'stat' collapsed into one series."
            inputEl={
              <TagsInput
                width={16}
                tags={tagCollapseChecks}
                onChange={addCollapseChecks} />}
          />
        </div>
      </div>
      <h3 className="page-heading">Query Suggestions Rules</h3>
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <div className="gf-form">
            <Button onClick={addQuerySuggestionRule} icon="fa fa-plus" />
          </div>
        </div>
        {suggestionRules.map((rule: any, index: number) => (
          <div className="gf-form-group" key={`${rule.id}-${index}`}>
            <div className="gf-form-inline">
              <FormField
                type="text"
                label="Description"
                className="gf-form max-width-120"
                labelWidth={12}
                required
                width={7}
                onChange={onDescriptionChange(rule.id)}
                value={rule.description} />
              <div className="gf-form">
                <a onClick={removeRule(rule.id)}>
                  <div className="gf-form-label">
                    <Icon name="trash" />
                  </div>
                </a>
              </div>
            </div>
            <FormField
              type="text"
              label="Trigger Filter"
              labelWidth={12}
              className="gf-form gf-form--v-stretch"
              required
              spellCheck={false}
              placeholder="Trigger on this filter"
              tooltip="A Heroic JSON formatted query filter to trigger this suggestion"
              onChange={onTriggerFilterChange(rule.id)}
              value={rule.triggerFilter} />
            <FormField
              type="text"
              label="Suggested Filter"
              labelWidth={12}
              className="gf-form gf-form--v-stretch"
              required
              spellCheck={false}
              placeholder="Filter to Add"
              tooltip="A Heroic JSON formatted query filter to append to the current filter when this rule is triggered."
              onChange={onFilterChange(rule.id)}
              value={rule.filter} />
            <FormField
              type="text"
              label="Suggested Aggregation"
              labelWidth={12}
              className="gf-form gf-form--v-stretch"
              required
              spellCheck={false}
              placeholder="Aggregation to Add"
              tooltip="A Heroic JSON formatted query aggregation to append to the current aggregation when this rule is triggered."
              onChange={onAggregationChange(rule.id)}
              value={rule.aggregation} />
          </div>
        ))}
      </div>
    </>
  )
}