import React from 'react';
import { QueryButtonProps } from './types';

export const QueryButton = ({ disabled, onClick }: QueryButtonProps) => {
  const handleOnClick = (e) => {
    if (!disabled && onClick) onClick(e);
  }
  return (
    <div className="gf-form-label">
      <a onClick={handleOnClick}>
        <i className="fa fa-plus"></i>
      </a>
    </div>
  )
}