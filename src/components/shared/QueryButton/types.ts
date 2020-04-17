import { SyntheticEvent } from 'react';

export interface QueryButtonProps {
  onClick: (e: SyntheticEvent) => void;
  disabled: boolean;
}