import React, { createContext, useContext } from 'react';

const CurrentFilterState = createContext();
const CurrentFilterDispatch = createContext();

const initialState = {
  key: '',
  operator: '=',
  condition: 'AND',
  value: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'key-select': {
      return ({
        ...state, key: action.payload
      });
    }
    case 'operator-select': {
      return ({
        ...state, operator: action.payload
      });
    }
    case 'value-select': {
      return ({
        ...state, value: action.payload
      });
    }
    case 'reset': {
      return initialState;
    }
    default:
      return state;
  }
}

export const CurrentFilterProvider = (({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <CurrentFilterState.Provider value={state}>
      <CurrentFilterDispatch.Provider value={dispatch}>
        {children}
      </CurrentFilterDispatch.Provider>
    </CurrentFilterState.Provider>
  )
})

export const useCurrentFilter = () => {
  return [useContext(CurrentFilterState), useContext(CurrentFilterDispatch)]
}

