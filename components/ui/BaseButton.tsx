import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'outline';
  children: ReactNode;
  className?: string;
}

export default function BaseButton({ variant = 'solid', children, className = '', ...props }: BaseButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    solid: 'bg-brand-purple text-white px-5 py-2.5 rounded-lg hover:bg-brand-purple2 hover:-translate-y-px hover:shadow-card',
    ghost: 'bg-transparent border-2 border-brand-purple text-brand-purple px-4 py-2 rounded-lg hover:bg-brand-pale',
    outline: 'bg-white/10 border-2 border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/20',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
