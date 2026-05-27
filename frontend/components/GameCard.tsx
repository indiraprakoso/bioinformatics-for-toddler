import React from 'react';
import { GameMetadata } from '../types.ts';
import { playPopSound } from '../services/audioService.ts';

interface GameCardProps {
    game: GameMetadata;
    title: string;
    description: string;
    onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, title, description, onClick }) => {
    const handleClick = () => {
        playPopSound();
        onClick();
    };

    return (
        <div 
            onClick={handleClick}
            className={`${game.colorClass} rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 shadow-bubbly hover:shadow-bubbly-hover border-4 border-white/50 group flex flex-col h-full`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="text-6xl mb-4 group-hover:animate-bounce origin-bottom">
                {game.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                {title}
            </h3>
            <p className="text-slate-700 font-medium flex-grow">
                {description}
            </p>
            <div className="mt-4 flex justify-end">
                <div className="bg-white/40 rounded-full p-2 group-hover:bg-white/60 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};
