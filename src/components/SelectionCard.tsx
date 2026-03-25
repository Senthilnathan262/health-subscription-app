import React from 'react';
import classNames from 'classnames';

export interface SelectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  selected?: boolean;
  type?: 'checkbox' | 'radio';
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  selected = false,
  type = 'checkbox',
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      className={classNames('selection-card', selected && 'selected', className)}
      onClick={onClick}
      {...props}
    >
      <input
        type={type}
        className="checkbox-input"
        checked={selected}
        readOnly
        tabIndex={-1}
      />
      <div className="flex-col">
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{title}</span>
        {description && (
          <span className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
