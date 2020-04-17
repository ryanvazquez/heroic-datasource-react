import { SyntheticEvent, FunctionComponentElement } from 'react';

export interface QueryRowWarnings {
  warnings: any[];
  setWarnings: (warnings: any[]) => void;
}

export interface QueryRowProps<T> {
  label?: string;
  expand?: boolean;
  options?: any | Array<any>;
  field?: ({ warnings, setWarnings }: QueryRowWarnings) => FunctionComponentElement<T>;
  fieldProps?: any;
  onAdd?: (e: SyntheticEvent) => void;
  displayButton?: boolean;
};