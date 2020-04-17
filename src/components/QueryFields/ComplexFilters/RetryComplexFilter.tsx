import React from 'react';
import { Spinner, Input } from '@grafana/ui';
import { useParser } from '../../../hooks';

const Icon = ({ isValid }) => (
  <i
    style={{ padding: '0 .5em', color: isValid ? 'green' : 'red', cursor: 'pointer' }}
    className={(isValid ? "fa fa-check-circle" : "fa fa-times-circle")} />
);

export const RetryComplexFilter = React.forwardRef((props, ref) => {
  const { onSuccess, onError, value } = props;
  const [current, setCurrent] = React.useState(value);
  const [loading, ok, error] = useParser(current);

  React.useEffect(() => {
    if (ok) {
      onSuccess(ok)
    }
    if (error) {
      onError(error)
    }
  }, [ok, error]);

  const handleOnKeyDown = e => e.key === 'Enter' && setCurrent(ref.current.value)

  return (
    <div className="gf-form-inline" style={{ margin: '1em 0' }}>
      <div className="gf-form-label">
        {loading ? <Spinner /> : <Icon isValid={ok} />}
      </div>
      <Input
        className="gf-form"
        inputRef={ref}
        onKeyDown={handleOnKeyDown} />
    </div>
  )
});