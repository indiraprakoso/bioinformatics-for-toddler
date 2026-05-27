import React from 'react';
import { playPopSound } from '../services/audioService.ts';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    onClick, 
    ...props 
}) => {
    const baseStyles = "font-bold py-3 px-6 rounded-full transition-all duration-200 transform active:scale-95 shadow-bubbly hover:shadow-bubbly-hover hover:-translate-y-1 flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-pastel-yellow text-slate-800 hover:bg-yellow-300 border-4 border-yellow-400",
        secondary: "bg-white text-slate-700 hover:bg-slate-50 border-4 border-slate-200",
        outline: "bg-transparent text-slate-700 border-4 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playPopSound();
        if (onClick) onClick(e);
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
};
