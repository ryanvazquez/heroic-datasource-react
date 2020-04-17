import React from 'react';
import { FormLabel, Input, Spinner } from '@grafana/ui';
import { ErrorModal } from './ErrorModal';
import { QueryRow, QueryButton, EditableField } from '../../shared';
import { useParser } from '../../../hooks';

/* 
  TODO: Add types
*/

const handleOnKeyDown = (map) => e => {
  if (e.key in map) {
    map[e.key](e);
  }
}

const Value = ({ value, onClick }) => (
  <React.Fragment>
    {value}
    <i style={{ padding: '0 .5em', color: 'white', cursor: 'pointer' }} className="fa fa-times-circle" onClick={onClick} />
  </React.Fragment>
);

export const FocusedInput = ({ ...props }) => {
  const inputRef = React.useRef(props.inputRef);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  });

  return <Input inputRef={inputRef} {...props} />
}

const ComplexFilter = React.memo(function ({ tag, onChange }) {
  const [loading, ok, error] = useParser(tag.value);
  const [current, setCurrent] = React.useState('');
  const { value } = tag;

  const removeComplexFilter = () => {
    onChange({ type: 'remove-complex-filter', meta: { tag } });
  }

  const updateComplexFilter = value => {
    onChange({ type: 'update-complex-filter', payload: value, meta: { tag } });
  }

  const updateFilterAndReset = () => {
    if (current === value) return;
    if (current) {
      updateComplexFilter(current);
    } else {
      removeComplexFilter();
    }
  }

  return (
    <EditableField>{
      (isEditing, setIsEditing) => {
        // if the user clicks away, update the filter
        if (!isEditing && current) updateFilterAndReset();
        return (
          isEditing
            ? <FocusedInput
              value={(current || value)}
              onChange={e => setCurrent(e.target.value)}
              style={{ width: '250px' }}
              onKeyDown={handleOnKeyDown({
                'Enter': (e) => {
                  e.preventDefault();
                  updateFilterAndReset();
                  setIsEditing(false);
                },
                'Tab': (e) => {
                  e.preventDefault();
                  updateFilterAndReset();
                  setIsEditing(false);
                }
              })} />
            : <a>
              <label
                className="gf-form-label"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}>
                {loading
                  ? <Spinner />
                  : ok
                    ? <Value value={value} onClick={removeComplexFilter} />
                    : error
                      ? <ErrorModal
                        value={value}
                        error={error.error.data}
                        onChange={updateComplexFilter} />
                      : <Value value={value} onClick={removeComplexFilter} />}
              </label>
            </a>
        )
      }
    }</EditableField>
  )
});

export const ComplexFilters = React.memo(function ({ label, filters, onChange }) {
  const [current, setCurrent] = React.useState('');

  const addFilterAndReset = () => {
    onChange({ type: 'add-complex-filter', payload: current });
    setCurrent('');
  }

  return (
    <QueryRow>
      <div className="gf-form">
        <FormLabel className="query-keyword">
          <span>{label}</span>
        </FormLabel>
        {filters.map(tag => <ComplexFilter tag={tag} onChange={onChange} />)}
        <EditableField>{
          (isEditing, setIsEditing) => {
            if (!isEditing && current) addFilterAndReset();
            return (
              isEditing
                ? <FocusedInput
                  style={{ width: '250px' }}
                  value={current}
                  onChange={e => setCurrent(e.target.value)}
                  onKeyDown={handleOnKeyDown({
                    'Enter': (e) => {
                      e.preventDefault();
                      addFilterAndReset();
                      setIsEditing(false);
                    },
                    'Tab': (e) => {
                      e.preventDefault();
                      addFilterAndReset();
                      setIsEditing(false);
                    }
                  })} />
                : <QueryButton
                  onClick={() => setIsEditing(true)}
                  disabled={false} />
            )
          }
        }</EditableField>
      </div>
    </QueryRow>
  );
});