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
  // iOS 26 style: High border radius, smooth interactions
  const baseStyles = "relative inline-flex items-center justify-center transition-all duration-500 font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-ios-primary text-white hover:bg-black/80 px-8 py-4 rounded-full text-base shadow-lg hover:shadow-xl",
    secondary: "bg-white/50 backdrop-blur-md border border-white/40 text-ios-text hover:bg-white/80 px-6 py-3 rounded-full text-sm shadow-sm",
    ghost: "bg-transparent text-ios-subtext hover:text-ios-text px-4 py-2 text-sm",
    icon: "p-3 rounded-full bg-white/40 backdrop-blur-md text-ios-text hover:bg-white/60 shadow-sm border border-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-5 w-5 text-current opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="tracking-wide text-sm opacity-80">ТВОРЮ...</span>
        </span>
      ) : children}
    </button>
  );
};