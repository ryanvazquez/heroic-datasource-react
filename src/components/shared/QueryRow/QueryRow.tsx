import React from 'react';
import { QueryRowProps } from './types';

export const QueryRow = React.memo(function QueryRow<T>({
  children,
  expand = true,
}: React.PropsWithChildren<QueryRowProps<T>>) {

  return (
    <div className="gf-form-inline">
      {children}
      {expand ? <div className="gf-form-label gf-form-label--grow"></div> : null}
    </div>
  )
});