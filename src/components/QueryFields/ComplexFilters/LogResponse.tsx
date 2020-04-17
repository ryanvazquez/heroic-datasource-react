import React from 'react';
import { Collapse } from '@grafana/ui';

export const LogResponse = ({ data, children, ...collapseProps }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapse onToggle={() => setIsOpen(!isOpen)} isOpen={isOpen} {...collapseProps}>
      {children}
    </Collapse>
  )
}