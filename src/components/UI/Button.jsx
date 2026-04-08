import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'premium-gradient text-white border-transparent',
    secondary: 'bg-surface border border-border text-text-main hover:bg-background',
    danger: 'bg-error text-white border-transparent hover:bg-error/90',
    outline: 'border border-border text-text-main hover:bg-background',
  };

  const baseClass = 'px-4 py-2 font-semibold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2';
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
