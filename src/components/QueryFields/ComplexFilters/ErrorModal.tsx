import React from 'react';
import { Modal } from '@grafana/ui';
import { SyntaxHelp } from './SyntaxHelp';
import { RetryComplexFilter } from './RetryComplexFilter';
import { LogResponse } from './LogResponse';

/* 
  TODO: Display custom message based on error type
  TODO: Add types
  BUGFIX: Display 
*/

export const ErrorModal = ({
  error,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [current, setCurrent] = React.useState({});

  const input = React.useRef();

  const handleOnClick = e => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  const getValue = () => {
    return current && current.value ? current.value : value;
  }

  const getError = () => {
    return current && current.error ? current.error.error.data.message : '';
  }

  const getResult = (callback?) => {
    const result = current ? current.result : null;
    if (callback) {
      return callback(result);
    }
    return result;
  }

  const getLabel = () => {
    return current.error ? 'Display error' : 'Display result';
  }

  const getData = () => {
    return current.error ? current.error : current.result;
  }

  const onSuccess = (res) => {
    setIsValid(true);
    setCurrent({ result: res, error: null, value: input.current.value });
  }

  const onError = (err) => {
    setIsValid(false);
    setCurrent({ result: null, error: err, value: input.current.value });
  }

  const onDismiss = () => onChange(getValue())
  const onClickBackdrop = () => onChange(getValue())

  const stringify = (value) => {
    return value ? JSON.stringify(value, null, 2) : '';
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <span style={{ color: 'red' }}>{value}</span>
      <i style={{ padding: '0 .5em', color: 'red', cursor: 'pointer' }} className="fa fa-info-circle" onClick={handleOnClick} />
      <Modal
        isOpen={isOpen}
        title="Complex Filter Help"
        onDismiss={onDismiss}
        onClickBackdrop={onClickBackdrop}>
        {isValid
          ?
          <React.Fragment>
            <h3>Looks good!</h3>
            <h5>You can close this window and your filter will be saved.</h5>
            <pre>{(current.value || value)}</pre>
            <h4>Or test another filter</h4>
          </React.Fragment>
          :
          <React.Fragment>
            <h3>Oops! Heroic wasn't able to parse this filter because of a syntax error.</h3>
            <pre>{getError()}</pre>
            <pre>{(current.value || value)}</pre>
            <h4>Try again</h4>
          </React.Fragment>}
        <RetryComplexFilter
          ref={input}
          value={getValue()}
          onSuccess={onSuccess}
          onError={onError} />
        <SyntaxHelp isCollapsed={!current.result} />
        <LogResponse
          label={getLabel()}
          data={getData()}>
          <pre>{getResult(stringify)}</pre>
        </LogResponse>
      </Modal>
    </div>
  )
}