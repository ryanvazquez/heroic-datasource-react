import React from 'react';
import { Segment } from '@grafana/ui';
import { EditableField, QueryButton } from '../../shared';
import { defaultOptions, operators } from './util';

/* 
  TODO: Fix bug where if a user clicks on a filter to select, then clicks away to deselect, the filter remains selected.
  TODO: Fix bug where tag suggestions appear incorrectly in value dropdown. Suggested tags for a value should factor in
        a filter's key AND all current filters. A key's suggestion should factor in only ALL current filters.
  TODO: Add styling to filter to show selected state.
*/

const handleOnKeyDown = (map) => e => {
  if (e.key in map) {
    map[e.key](e);
  }
}

const noop = () => { }

const And = () => (
  <div className="gf-form">
    <div className="gf-form-label query-part query-keyword">AND</div>
  </div>
);

const Key = ({ value }) => {
  return value === '$key' ? <span className="query-keyword">{value}</span> : value;
};

const Operator = ({ value }) => (
  <span style={{ padding: '0 .5em' }} className="query-segment-operator">{value}</span>
)

const HoverField = ({ children, Component, ...props }) => {
  const [isHovering, setState] = React.useState(false);

  return (
    <div className="gf-form-label" onMouseOver={() => setState(true)} onMouseLeave={() => setState(false)} {...props}>
      {children}
      {isHovering && <span><Component /></span>}
    </div>
  );
}

export const FilterExpression = ({
  tag,
  options,
  editMode,
  variables,
  onChange,
  displayAnd,
  displaySegments,
}) => {

  const { key, operator, value } = tag;
  const segmentOptions = defaultOptions.concat((variables || []), options);
  const [isActive, setIsActive] = React.useState(undefined);

  const RemoveFilterIcon = () => (
    <i style={{ padding: '0 .5em', color: 'white', cursor: 'pointer' }} className="fa fa-times-circle" onClick={() => onChange({ type: 'remove-filter', meta: { tag } })} />
  );

  if (displaySegments) {
    return (
      <div className="gf-form-inline" onKeyDown={handleOnKeyDown({
        'Backspace': (e) => {
          e.preventDefault();
          onChange({ type: 'remove-filter', meta: { tag } });
        }
      })}>
        {displayAnd && <And />}
        {<EditableField initialState={editMode} editIf={!!value}>{
          (editing, setIsEditing) => {
            return (
              editing
                ?
                <React.Fragment>
                  <Segment
                    options={segmentOptions}
                    allowCustomValue={true}
                    value={key}
                    onChange={({ value }) => onChange({ type: 'key-select', payload: value, meta: { tag } })} />
                  <Segment
                    allowCustomValue={false}
                    className="query-segment-operator"
                    value={operator}
                    options={operators}
                    onChange={({ value }) => onChange({ type: 'operator-select', payload: value, meta: { tag } })} />
                  <Segment
                    options={options} // do not display tag suggestions;
                    allowCustomValue={true}
                    value={(value || 'select')}
                    onChange={({ value }) => {
                      setIsEditing(false);
                      onChange({ type: 'value-select', payload: value, meta: { tag } });
                    }} />
                </React.Fragment>
                :
                <HoverField Component={RemoveFilterIcon}
                // style={{ border: isActive ? '1px solid green' : 'inherit' }}
                >
                  <span
                    onDoubleClick={() => setIsEditing(true)}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent click event from being captured by click away handler
                      isActive === undefined
                        ? setIsActive(true)
                        : isActive
                          ? function () {
                            setIsEditing(true);
                            setIsActive(false);
                          }()
                          : setIsActive(undefined);
                    }}>
                    <Key value={key} />
                    <Operator value={operator} />
                    {value}
                  </span>
                </HoverField>
            )
          }
        }</EditableField>
        }
      </div>
    );
  }

  return (
    <Segment
      Component={<QueryButton disabled onClick={noop} />}
      options={key === '$key' ? segmentOptions : segmentOptions.filter(opt => opt.value !== '$key')}
      value={(key || '+')}
      onChange={({ value }) => onChange({ type: 'key-select', payload: value, meta: { tag } })} />
  );
};