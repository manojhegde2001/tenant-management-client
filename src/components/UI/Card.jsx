import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-bold text-text-main tracking-tight', className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-text-muted', className)}>{children}</p>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

export default Card;
