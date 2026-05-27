import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button.tsx';
import { playPopSound } from '../services/audioService.ts';
import { Game3Translations } from '../types.ts';
import { PHYLO_ROUNDS, ORGANISM_ICONS } from '../constants.ts';

// --- Tree Drawing Components ---
const CladeChild: React.FC<{ children: React.ReactNode, isFirst: boolean, isLast: boolean }> = ({ children, isFirst, isLast }) => (
    <div className="flex items-center relative py-2 md:py-4">
        {/* Vertical line segment */}
        <div className={`absolute left-0 w-1 bg-slate-700
            ${isFirst ? 'top-1/2 bottom-0' : isLast ? 'top-0 bottom-1/2' : 'top-0 bottom-0'}
        `}></div>
        {/* Horizontal line */}
        <div className="w-4 md:w-8 h-1 bg-slate-700"></div>
        {children}
    </div>
);

const Clade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const count = React.Children.count(children);
    return (
        <div className="flex items-center">
            <div className="w-4 md:w-8 h-1 bg-slate-700"></div>
            <div className="flex flex-col">
                {React.Children.map(children, (child, i) => (
                    <CladeChild isFirst={i === 0} isLast={i === count - 1}>
                        {child}
                    </CladeChild>
                ))}
            </div>
        </div>
    );
};

export const Game3PhyloTree: React.FC<{ translations: Game3Translations }> = ({ translations }) => {
    const [gameState, setGameState] = useState<'playing' | 'gameover' | 'won'>('playing');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [roundIndex, setRoundIndex] = useState(0);
    
    const [pool, setPool] = useState<string[]>([]);
    const [slots, setSlots] = useState<(string | null)[]>([]);
    const [isError, setIsError] = useState(false);

    const currentRound = PHYLO_ROUNDS[roundIndex];

    const startRound = useCallback((index: number) => {
        const round = PHYLO_ROUNDS[index];
        // Shuffle organisms for the pool
        const shuffled = [...round.organisms].sort(() => 0.5 - Math.random());
        setPool(shuffled);
        setSlots(new Array(round.organisms.length).fill(null));
        setIsError(false);
    }, []);

    // Initial load
    useEffect(() => {
        startRound(0);
    }, [startRound]);

    const handlePoolClick = (organismId: string) => {
        if (gameState !== 'playing') return;
        playPopSound();

        // Find first empty slot
        const emptyIndex = slots.findIndex(s => s === null);
        if (emptyIndex !== -1) {
            const newSlots = [...slots];
            newSlots[emptyIndex] = organismId;
            setSlots(newSlots);
            setPool(pool.filter(id => id !== organismId));
            setIsError(false);
        }
    };

    const handleSlotClick = (index: number) => {
        if (gameState !== 'playing') return;
        const organismId = slots[index];
        if (organismId) {
            playPopSound();
            const newSlots = [...slots];
            newSlots[index] = null;
            setSlots(newSlots);
            setPool([...pool, organismId]);
            setIsError(false);
        }
    };

    const handleDrop = (organismId: string, slotIndex: number) => {
        if (gameState !== 'playing') return;
        
        // If slot is already occupied, swap them or just return to pool
        const existingInSlot = slots[slotIndex];
        
        playPopSound();
        const newSlots = [...slots];
        newSlots[slotIndex] = organismId;
        
        // Remove from old position (either pool or another slot)
        let newPool = pool.filter(id => id !== organismId);
        const oldSlotIndex = slots.findIndex(s => s === organismId);
        if (oldSlotIndex !== -1) {
            newSlots[oldSlotIndex] = existingInSlot; // Swap
        } else if (existingInSlot) {
            newPool.push(existingInSlot); // Return old to pool
        }

        setSlots(newSlots);
        setPool(newPool);
        setIsError(false);
    };

    const handleCheckAnswer = () => {
        if (gameState !== 'playing') return;
        playPopSound();

        // Check if all slots are filled
        if (slots.some(s => s === null)) {
            setIsError(true);
            return;
        }

        // Validate against allowed configurations
        const currentConfig = slots.join(',');
        const isCorrect = currentRound.validAnswers.some(ans => ans.join(',') === currentConfig);

        if (isCorrect) {
            setScore(s => s + 20);
            if (roundIndex + 1 < PHYLO_ROUNDS.length) {
                setRoundIndex(r => r + 1);
                startRound(roundIndex + 1);
            } else {
                setGameState('won');
            }
        } else {
            setIsError(true);
            if (lives > 1) {
                setLives(l => l - 1);
                // Return all to pool to try again
                setPool([...pool, ...slots.filter(s => s !== null) as string[]]);
                setSlots(new Array(currentRound.organisms.length).fill(null));
            } else {
                setLives(0);
                setGameState('gameover');
            }
        }
    };

    const resetGame = () => {
        setScore(0);
        setLives(3);
        setRoundIndex(0);
        setGameState('playing');
        startRound(0);
    };

    // --- Render Helpers ---
    const renderSlot = (index: number) => {
        const organismId = slots[index];
        return (
            <div
                onClick={() => handleSlotClick(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleDrop(e.dataTransfer.getData('text/plain'), index); }}
                className={`w-20 h-24 md:w-24 md:h-28 rounded-2xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white
                    ${organismId ? 'border-pastel-pink shadow-bubbly hover:scale-105 border-solid' : 'border-slate-300 border-dashed hover:bg-slate-50'}
                    ${isError && !organismId ? 'border-rose-400 bg-rose-50' : ''}
                `}
            >
                {organismId ? (
                    <>
                        <span className="text-3xl md:text-4xl mb-1">{ORGANISM_ICONS[organismId]}</span>
                        <span className="font-bold text-slate-700 text-xs md:text-sm text-center px-1 leading-tight">{translations.organisms[organismId]}</span>
                    </>
                ) : (
                    <span className="text-slate-300 text-xs font-bold text-center px-2">{translations.dropHere}</span>
                )}
            </div>
        );
    };

    const renderTree = () => {
        if (currentRound.treeType === '3-unbalanced') {
            return (
                <Clade>
                    <Clade>
                        {renderSlot(0)}
                        {renderSlot(1)}
                    </Clade>
                    {renderSlot(2)}
                </Clade>
            );
        }
        if (currentRound.treeType === '4-balanced') {
            return (
                <Clade>
                    <Clade>
                        {renderSlot(0)}
                        {renderSlot(1)}
                    </Clade>
                    <Clade>
                        {renderSlot(2)}
                        {renderSlot(3)}
                    </Clade>
                </Clade>
            );
        }
        if (currentRound.treeType === '4-unbalanced') {
            return (
                <Clade>
                    <Clade>
                        <Clade>
                            {renderSlot(0)}
                            {renderSlot(1)}
                        </Clade>
                        {renderSlot(2)}
                    </Clade>
                    {renderSlot(3)}
                </Clade>
            );
        }
        return null;
    };

    if (gameState === 'gameover' || gameState === 'won') {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-300 flex-grow">
                <div className="text-6xl mb-2">{gameState === 'won' ? '🏆' : '🥀'}</div>
                <h2 className="text-4xl font-bold text-slate-800">
                    {gameState === 'won' ? translations.gameWon : translations.gameOver}
                </h2>
                <p className="text-2xl text-slate-600 font-bold">
                    {translations.score}: <span className="text-pastel-pink drop-shadow-sm">{score}</span>
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
                    ⭐ <span className="hidden md:inline">{translations.score}:</span> <span className="text-2xl text-pastel-pink drop-shadow-sm">{score}</span>
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-500 bg-white px-4 py-1 rounded-full">
                    {translations.level} {roundIndex + 1} / {PHYLO_ROUNDS.length}
                </div>
                <div className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={i < lives ? "opacity-100" : "opacity-20 grayscale"}>❤️</span>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 text-center">
                <p className="text-sm md:text-base font-bold text-slate-700 bg-pastel-yellow/40 inline-block px-6 py-3 rounded-2xl shadow-sm border-2 border-pastel-yellow max-w-3xl">
                    🌳 {translations.instructions}
                </p>
            </div>

            {/* Main Game Area */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center flex-grow gap-8 w-full max-w-5xl mx-auto">
                
                {/* Left: Distance Matrix */}
                <div className="w-full lg:w-auto bg-white p-4 md:p-6 rounded-3xl shadow-bubbly border-4 border-slate-200 overflow-x-auto">
                    <h3 className="text-lg font-bold text-slate-600 mb-4 text-center uppercase tracking-wider">
                        📊 {translations.matrixTitle}
                    </h3>
                    <table className="border-collapse w-full text-sm md:text-base">
                        <thead>
                            <tr>
                                <th className="p-2 border-b-2 border-r-2 border-slate-300 bg-slate-50 rounded-tl-xl"></th>
                                {currentRound.organisms.map(org => (
                                    <th key={org} className="p-2 border-b-2 border-slate-300 bg-slate-50 font-bold text-slate-700">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl">{ORGANISM_ICONS[org]}</span>
                                            <span className="hidden md:block text-xs mt-1">{translations.organisms[org]}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentRound.matrix.map((row, i) => (
                                <tr key={i}>
                                    <th className="p-2 border-r-2 border-slate-300 bg-slate-50 font-bold text-slate-700 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{ORGANISM_ICONS[currentRound.organisms[i]]}</span>
                                            <span className="hidden md:block text-xs">{translations.organisms[currentRound.organisms[i]]}</span>
                                        </div>
                                    </th>
                                    {row.map((val, j) => (
                                        <td key={j} className={`p-3 md:p-4 text-center border-slate-200 ${i !== currentRound.organisms.length - 1 ? 'border-b' : ''} ${j !== currentRound.organisms.length - 1 ? 'border-r' : ''}`}>
                                            <span className={`inline-block w-8 h-8 leading-8 rounded-full ${val === 0 ? 'bg-slate-100 text-slate-400' : 'bg-pastel-blue/30 text-slate-800 font-extrabold'}`}>
                                                {val}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right: Phylo-Tree & Pool */}
                <div className="flex flex-col items-center gap-8 w-full lg:w-auto">
                    
                    {/* The Tree */}
                    <div className="bg-slate-50/50 p-4 md:p-8 rounded-3xl border-4 border-slate-200/50 flex justify-center w-full overflow-x-auto">
                        {renderTree()}
                    </div>

                    {/* Check Button */}
                    <Button 
                        variant="primary" 
                        onClick={handleCheckAnswer}
                        className={`text-lg w-full max-w-xs ${isError ? 'animate-shake bg-rose-200 border-rose-400 text-rose-800 hover:bg-rose-300' : ''}`}
                    >
                        {translations.checkAnswer}
                    </Button>

                    {/* Pool of Organisms */}
                    <div className="w-full bg-white/60 p-4 md:p-6 rounded-3xl border-4 border-white shadow-inner">
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-h-[7rem]">
                            {pool.map((organismId) => (
                                <div
                                    key={organismId}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', organismId)}
                                    onClick={() => handlePoolClick(organismId)}
                                    className="bg-white border-4 border-slate-200 rounded-2xl p-2 shadow-sm hover:shadow-bubbly hover:border-pastel-pink hover:-translate-y-1 cursor-pointer transition-all duration-200 w-20 h-24 md:w-24 md:h-28 flex flex-col items-center justify-center active:scale-95"
                                >
                                    <span className="text-3xl md:text-4xl mb-1">{ORGANISM_ICONS[organismId]}</span>
                                    <span className="font-bold text-slate-700 text-xs md:text-sm text-center px-1 leading-tight">{translations.organisms[organismId]}</span>
                                </div>
                            ))}
                            {pool.length === 0 && (
                                <div className="flex items-center justify-center w-full text-slate-400 font-bold text-sm md:text-base">
                                    All placed! Verify your tree.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
