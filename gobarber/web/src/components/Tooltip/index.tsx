import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  className?: string;
  title: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  className = '',
  title,
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
