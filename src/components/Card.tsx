import React from 'react';
import classNames from 'classnames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames('glass-panel animate-fade-in', className)} {...props}>
      {children}
    </div>
  );
};
