import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button.tsx';
import { playPopSound } from '../services/audioService.ts';
import { Game4Translations } from '../types.ts';
import { BIO_WORDS } from '../constants.ts';

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

const checkGuess = (guess: string, target: string): LetterStatus[] => {
    const result: LetterStatus[] = new Array(5).fill('absent');
    const targetChars = target.split('');
    const guessChars = guess.split('');

    // First pass: find correct (green)
    guessChars.forEach((char, i) => {
        if (char === targetChars[i]) {
            result[i] = 'correct';
            targetChars[i] = null as any;
        }
    });

    // Second pass: find present (yellow)
    guessChars.forEach((char, i) => {
        if (result[i] !== 'correct' && targetChars.includes(char)) {
            result[i] = 'present';
            targetChars[targetChars.indexOf(char)] = null as any;
        }
    });

    return result;
};

export const Game4BioWordle: React.FC<{ translations: Game4Translations }> = ({ translations }) => {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [score, setScore] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const startRound = useCallback(() => {
        const randomWord = BIO_WORDS[Math.floor(Math.random() * BIO_WORDS.length)];
        setTargetWord(randomWord);
        setGuesses([]);
        setCurrentGuess('');
        setGameStatus('playing');
    }, []);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const onKeyPress = useCallback((key: string) => {
        if (gameStatus !== 'playing') return;

        if (key === 'ENTER') {
            if (currentGuess.length !== 5) {
                showToast(translations.notEnoughLetters);
                return;
            }
            
            playPopSound();
            const newGuesses = [...guesses, currentGuess];
            setGuesses(newGuesses);
            setCurrentGuess('');

            if (currentGuess === targetWord) {
                setGameStatus('won');
                setScore(s => s + (7 - newGuesses.length) * 10); // More points for fewer guesses
            } else if (newGuesses.length >= 6) {
                setGameStatus('lost');
            }
        } else if (key === 'BACKSPACE') {
            playPopSound();
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
            playPopSound();
            setCurrentGuess(prev => prev + key);
        }
    }, [currentGuess, gameStatus, guesses, targetWord, translations.notEnoughLetters]);

    // Physical keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            
            if (e.key === 'Enter') {
                onKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                onKeyPress('BACKSPACE');
            } else {
                const key = e.key.toUpperCase();
                if (/^[A-Z]$/.test(key)) {
                    onKeyPress(key);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKeyPress]);

    // Calculate keyboard colors
    const keyboardColors: Record<string, LetterStatus> = {};
    guesses.forEach(guess => {
        const statuses = checkGuess(guess, targetWord);
        guess.split('').forEach((char, i) => {
            const currentStatus = keyboardColors[char];
            const newStatus = statuses[i];
            if (currentStatus !== 'correct') {
                if (newStatus === 'correct' || (newStatus === 'present' && currentStatus !== 'present')) {
                    keyboardColors[char] = newStatus;
                } else if (!currentStatus) {
                    keyboardColors[char] = newStatus;
                }
            }
        });
    });

    const getCellColor = (status: LetterStatus) => {
        switch (status) {
            case 'correct': return 'bg-emerald-400 text-white border-emerald-500';
            case 'present': return 'bg-amber-400 text-white border-amber-500';
            case 'absent': return 'bg-slate-400 text-white border-slate-500';
            default: return 'bg-white text-slate-800 border-slate-200';
        }
    };

    const getKeyColor = (key: string) => {
        const status = keyboardColors[key];
        switch (status) {
            case 'correct': return 'bg-emerald-400 text-white';
            case 'present': return 'bg-amber-400 text-white';
            case 'absent': return 'bg-slate-400 text-white opacity-50';
            default: return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
        }
    };

    return (
        <div className="flex flex-col h-full w-full flex-grow animate-in fade-in duration-300 relative items-center">
            
            {/* Header: Stats */}
            <div className="flex justify-between items-center mb-4 bg-white/50 p-4 rounded-2xl shadow-sm w-full max-w-md">
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-2">
                    ⭐ <span>{translations.score}:</span> <span className="text-2xl text-pastel-blue drop-shadow-sm">{score}</span>
                </div>
                <div className="text-sm md:text-base font-bold text-slate-500 bg-white px-4 py-1 rounded-full">
                    {guesses.length} / 6
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 text-center">
                <p className="text-sm md:text-base font-bold text-slate-700 bg-pastel-yellow/40 inline-block px-6 py-2 rounded-full shadow-sm border-2 border-pastel-yellow">
                    ⌨️ {translations.instructions}
                </p>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-24 z-50 bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-in slide-in-from-top-4 fade-in duration-200">
                    {toastMessage}
                </div>
            )}

            {/* Wordle Grid */}
            <div className="grid grid-rows-6 gap-2 mb-8">
                {Array.from({ length: 6 }).map((_, rowIndex) => {
                    const isCurrentRow = rowIndex === guesses.length;
                    const guess = isCurrentRow ? currentGuess : guesses[rowIndex] || '';
                    const statuses = guesses[rowIndex] ? checkGuess(guesses[rowIndex], targetWord) : new Array(5).fill('empty');

                    return (
                        <div key={rowIndex} className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, colIndex) => {
                                const char = guess[colIndex] || '';
                                const status = statuses[colIndex];
                                const isTyping = isCurrentRow && char !== '';
                                
                                return (
                                    <div 
                                        key={colIndex} 
                                        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl font-extrabold rounded-xl border-4 transition-all duration-300
                                            ${getCellColor(status)}
                                            ${isTyping ? 'border-pastel-blue scale-105' : ''}
                                            ${status !== 'empty' ? 'animate-in zoom-in duration-300' : ''}
                                        `}
                                    >
                                        {char}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Virtual Keyboard */}
            <div className="w-full max-w-lg flex flex-col gap-2 px-2">
                {KEYBOARD_ROWS.map((row, i) => (
                    <div key={i} className="flex justify-center gap-1 md:gap-2">
                        {row.map(key => {
                            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
                            const displayKey = key === 'BACKSPACE' ? '⌫' : key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => onKeyPress(key)}
                                    className={`font-bold rounded-lg flex items-center justify-center transition-colors active:scale-95 shadow-sm
                                        ${isSpecial ? 'px-3 md:px-4 text-xs md:text-sm' : 'w-8 md:w-10 text-sm md:text-base'} 
                                        h-12 md:h-14
                                        ${getKeyColor(key)}
                                    `}
                                >
                                    {displayKey}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Win/Loss Modal */}
            {gameStatus !== 'playing' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm rounded-3xl animate-in fade-in zoom-in duration-300">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl border-4 border-pastel-blue w-full max-w-md flex flex-col items-center text-center">
                        <div className="text-6xl mb-4">
                            {gameStatus === 'won' ? '🎉' : '📚'}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                            {gameStatus === 'won' ? translations.gameOverWin : translations.gameOverLose}
                        </h2>
                        
                        <div className="my-6 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 w-full shadow-inner">
                            <div className="text-4xl font-extrabold text-pastel-blue tracking-widest mb-4">
                                {targetWord}
                            </div>
                            <p className="text-slate-600 font-medium text-lg leading-relaxed">
                                {translations.dictionary[targetWord]}
                            </p>
                        </div>

                        <Button variant="primary" onClick={startRound} className="w-full text-xl">
                            🔄 {translations.playAgain}
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};
