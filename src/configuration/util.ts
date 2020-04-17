import shortid from 'shortid';

export const createId = () => shortid.generate();

export const createSuggestionRule = () => ({
  id: createId(),
  description: '',
  filter: '',
  triggerFilter: '',
  aggregation: '',
});

export const buildEventFactory = props => callback => id => event => {
  const { options, onOptionsChange } = props;
  const suggestion = options.jsonData.suggestionRules.find(rule => rule.id === id);
  const updatedRule = callback({ suggestion, event });
  onOptionsChange({
    ...options,
    jsonData: {
      ...options.jsonData,
      suggestionRules: options.jsonData.suggestionRules.map(rule => {
        return rule.id === id ? updatedRule : rule;
      })
    }
  })
};
