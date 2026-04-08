import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'input-base',
          error && 'border-error ring-error/10 focus:ring-error/20 focus:border-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-error ml-1">{error}</p>
      )}
    </div>
  );
});

export const Select = React.forwardRef(({ label, error, children, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'input-base appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%2364748b%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M6%208l4%204%204-4%27%2F%3E%3C%2Fsvg%3E")] bg-[position:right_0.5rem_center] bg-[size:1.5em_1.5em] bg-no-repeat pr-10',
          error && 'border-error ring-error/10 focus:ring-error/20 focus:border-error',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-[11px] font-medium text-error ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
Select.displayName = 'Select';

export default Input;
