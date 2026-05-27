import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button.tsx';
import { playPopSound } from '../services/audioService.ts';
import { Game2Translations, AminoAcidDef } from '../types.ts';
import { AMINO_ACIDS } from '../constants.ts';

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const Game2CodonChef: React.FC<{ translations: Game2Translations }> = ({ translations }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(10);
    const [targetAminoAcid, setTargetAminoAcid] = useState<AminoAcidDef | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const startRound = useCallback(() => {
        // Pick a random target amino acid
        const target = AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)];
        setTargetAminoAcid(target);

        // Generate wrong options
        const wrongOptions = AMINO_ACIDS
            .filter(aa => aa.id !== target.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map(aa => aa.codon);

        // Combine and shuffle
        const allOptions = shuffleArray([target.codon, ...wrongOptions]);
        setOptions(allOptions);
        setTimeLeft(10);
    }, []);

    // Initial load
    useEffect(() => {
        startRound();
    }, [startRound]);

    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing' || isModalOpen) return; // Pause timer if modal is open
        
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
    }, [timeLeft, gameState, lives, isModalOpen, startRound]);

    const handleOptionClick = (selectedCodon: string) => {
        if (gameState !== 'playing') return;
        playPopSound();

        if (targetAminoAcid && selectedCodon === targetAminoAcid.codon) {
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

    const toggleModal = () => {
        playPopSound();
        setIsModalOpen(!isModalOpen);
    };

    if (gameState === 'gameover') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-300 flex-grow">
                <div className="text-6xl mb-2">👨‍🍳🔥</div>
                <h2 className="text-4xl font-bold text-slate-800">{translations.gameOver}</h2>
                <p className="text-2xl text-slate-600 font-bold">
                    {translations.score}: <span className="text-pastel-purple drop-shadow-sm">{score}</span>
                </p>
                <Button onClick={resetGame} variant="primary" className="mt-4 text-xl">
                    🔄 {translations.playAgain}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full flex-grow animate-in fade-in duration-300 relative">
            {/* Header: Stats */}
            <div className="flex justify-between items-center mb-6 bg-white/50 p-4 rounded-2xl shadow-sm">
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-2">
                    ⭐ <span className="hidden md:inline">{translations.score}:</span> <span className="text-2xl text-pastel-purple drop-shadow-sm">{score}</span>
                </div>
                <div className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                    ⏱️ {timeLeft}s
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>❤️</span>
                    ))}
                </div>
            </div>

            {/* Instructions & Peek Button */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-base md:text-lg font-bold text-slate-700 bg-pastel-yellow/40 px-6 py-3 rounded-full shadow-sm border-2 border-pastel-yellow text-center flex-grow">
                    🍳 {translations.instructions}
                </p>
                <Button variant="secondary" onClick={toggleModal} className="shrink-0">
                    {translations.peekTable}
                </Button>
            </div>

            {/* Main Game Area */}
            <div className="flex flex-col items-center justify-center flex-grow gap-8">
                {/* Customer Order */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-bubbly border-4 border-pastel-purple w-full max-w-md text-center transform transition-transform hover:scale-105">
                    <h3 className="text-lg md:text-xl text-slate-500 font-bold uppercase tracking-widest mb-2">
                        🛎️ {translations.customerOrder}
                    </h3>
                    <div className="text-4xl md:text-5xl font-extrabold text-slate-800 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                        {targetAminoAcid ? translations.aminoAcids[targetAminoAcid.id] : '...'}
                    </div>
                </div>

                {/* Codon Options Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
                    {options.map((codon, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(codon)}
                            className="bg-white border-4 border-slate-200 hover:border-pastel-purple hover:bg-pastel-purple/20 text-slate-700 font-bold text-3xl md:text-4xl py-6 rounded-3xl shadow-bubbly hover:shadow-bubbly-hover transform transition-all active:scale-95"
                        >
                            {codon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Peek Table Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm rounded-3xl animate-in fade-in zoom-in duration-200">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl border-4 border-pastel-purple w-full max-w-lg flex flex-col max-h-full">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
                            📖 {translations.codonTableTitle}
                        </h2>
                        <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">
                                {AMINO_ACIDS.map((aa) => (
                                    <div key={aa.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                                        <span className="text-lg font-bold text-slate-700">{translations.aminoAcids[aa.id]}</span>
                                        <span className="text-xl font-extrabold text-pastel-purple bg-purple-100 px-4 py-1 rounded-lg">{aa.codon}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button variant="primary" onClick={toggleModal} className="mt-6 w-full">
                            {translations.closeTable}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
