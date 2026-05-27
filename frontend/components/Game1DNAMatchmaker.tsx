import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button.tsx';
import { playPopSound } from '../services/audioService.ts';
import { Game1Translations } from '../types.ts';

const BASES = ['A', 'T', 'C', 'G'];
const BASE_COLORS: Record<string, string> = {
    'A': 'bg-rose-400 text-white border-rose-500',
    'T': 'bg-sky-400 text-white border-sky-500',
    'C': 'bg-emerald-400 text-white border-emerald-500',
    'G': 'bg-amber-400 text-slate-800 border-amber-500',
};

const getRandomBase = (exclude = '') => {
    const available = BASES.filter(b => b !== exclude);
    return available[Math.floor(Math.random() * available.length)];
};

const generateRound = () => {
    const normal = Array.from({ length: 10 }, () => getRandomBase());
    const mutType = Math.floor(Math.random() * 3);
    let patient = [...normal];
    let mutIndex = 0;

    if (mutType === 0) { // Substitution
        mutIndex = Math.floor(Math.random() * 10);
        patient[mutIndex] = getRandomBase(normal[mutIndex]);
    } else if (mutType === 1) { // Insertion
        mutIndex = Math.floor(Math.random() * 11);
        patient.splice(mutIndex, 0, getRandomBase());
    } else { // Deletion
        // Restrict to 0-8 so the deleted index is never the very last character.
        // This ensures the patient DNA always has a character at `mutIndex` to click.
        mutIndex = Math.floor(Math.random() * 9);
        patient.splice(mutIndex, 1);
    }
    return { normal, patient, mutIndex };
};

const DNABlock = ({ base, isClickable, onClick }: { base: string, isClickable?: boolean, onClick?: () => void }) => {
    const colorClass = BASE_COLORS[base] || 'bg-gray-400';
    const baseStyles = `w-10 h-12 md:w-12 md:h-14 flex items-center justify-center text-xl md:text-2xl font-bold rounded-lg border-b-4 ${colorClass}`;
    
    if (isClickable) {
        return (
            <button 
                onClick={onClick}
                className={`${baseStyles} transform transition-transform hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-sm hover:shadow-md`}
            >
                {base}
            </button>
        );
    }
    return <div className={`${baseStyles} opacity-90`}>{base}</div>;
};

export const Game1DNAMatchmaker: React.FC<{ translations: Game1Translations }> = ({ translations }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(15);
    const [normalDNA, setNormalDNA] = useState<string[]>([]);
    const [patientDNA, setPatientDNA] = useState<string[]>([]);
    const [mutationIndex, setMutationIndex] = useState(0);

    const startRound = useCallback(() => {
        const { normal, patient, mutIndex } = generateRound();
        setNormalDNA(normal);
        setPatientDNA(patient);
        setMutationIndex(mutIndex);
        setTimeLeft(15);
    }, []);

    // Initial load
    useEffect(() => {
        startRound();
    }, [startRound]);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing') return;
        
        if (timeLeft === 0) {
            playPopSound();
            if (lives > 1) {
                setLives(l => l - 1);
                startRound();
            } else {
                setLives(0);
                setGameState('gameover');
            }
            return;
        }

        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, gameState, lives, startRound]);

    const handlePatientClick = (index: number) => {
        if (gameState !== 'playing') return;
        playPopSound();

        if (index === mutationIndex) {
            setScore(s => s + 10);
            startRound();
        } else {
            if (lives > 1) {
                setLives(l => l - 1);
            } else {
                setLives(0);
                setGameState('gameover');
            }
        }
    };

    const resetGame = () => {
        setScore(0);
        setLives(3);
        setGameState('playing');
        startRound();
    };

    if (gameState === 'gameover') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-300 flex-grow">
                <div className="text-6xl mb-2">💥</div>
                <h2 className="text-4xl font-bold text-slate-800">{translations.gameOver}</h2>
                <p className="text-2xl text-slate-600 font-bold">
                    {translations.score}: <span className="text-pastel-blue drop-shadow-sm">{score}</span>
                </p>
                <Button onClick={resetGame} variant="primary" className="mt-4 text-xl">
                    🔄 {translations.playAgain}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full flex-grow animate-in fade-in duration-300">
            {/* Header: Stats */}
            <div className="flex justify-between items-center mb-6 bg-white/50 p-4 rounded-2xl shadow-sm">
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-2">
                    ⭐ <span className="hidden md:inline">{translations.score}:</span> <span className="text-2xl text-pastel-blue drop-shadow-sm">{score}</span>
                </div>
                <div className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                    ⏱️ {timeLeft}s
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>❤️</span>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 text-center">
                <p className="text-base md:text-lg font-bold text-slate-700 bg-pastel-yellow/40 inline-block px-6 py-3 rounded-full shadow-sm border-2 border-pastel-yellow">
                    🕵️ {translations.instructions}
                </p>
            </div>

            {/* DNA Sequences */}
            <div className="flex flex-col gap-8 items-center justify-center flex-grow">
                {/* Normal DNA */}
                <div className="w-full max-w-2xl">
                    <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider text-left ml-2">
                        🧬 {translations.normalDna}
                    </div>
                    <div className="flex flex-wrap gap-1 md:gap-2 justify-start bg-slate-100 p-3 md:p-4 rounded-2xl border-2 border-slate-200 shadow-inner">
                        {normalDNA.map((base, i) => (
                            <DNABlock key={`normal-${i}`} base={base} />
                        ))}
                    </div>
                </div>

                {/* Patient DNA */}
                <div className="w-full max-w-2xl">
                    <div className="text-sm font-bold text-rose-500 mb-2 uppercase tracking-wider text-left ml-2">
                        🦠 {translations.patientDna}
                    </div>
                    <div className="flex flex-wrap gap-1 md:gap-2 justify-start bg-rose-50 p-3 md:p-4 rounded-2xl border-2 border-rose-200 shadow-inner">
                        {patientDNA.map((base, i) => (
                            <DNABlock 
                                key={`patient-${i}`} 
                                base={base} 
                                isClickable 
                                onClick={() => handlePatientClick(i)} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
