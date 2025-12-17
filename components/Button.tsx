import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center transition-all duration-300 font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-verum-gold text-verum-black hover:bg-white px-8 py-3 rounded-none uppercase tracking-widest text-xs font-bold shadow-[0_0_15px_rgba(201,162,77,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    secondary: "bg-transparent border border-verum-graphite text-verum-white hover:border-verum-gold hover:text-verum-gold px-6 py-2 rounded-none text-sm",
    ghost: "bg-transparent text-verum-gray hover:text-verum-white px-4 py-2 text-sm",
    icon: "p-2 rounded-full hover:bg-verum-graphite text-verum-gold"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ДУМАЮ...
        </span>
      ) : children}
    </button>
  );
};