import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'premium-gradient',
    secondary: 'bg-secondary text-white',
    danger: 'bg-error text-white',
    outline: 'border border-border text-text-main hover:bg-background',
  };

  const baseClass = 'px-4 py-2 font-medium shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2';
  
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
