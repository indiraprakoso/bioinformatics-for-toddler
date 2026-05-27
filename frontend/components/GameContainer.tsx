import React from 'react';
import { Button } from './Button.tsx';
import { GameMetadata, TranslationDictionary } from '../types.ts';
import { Game1DNAMatchmaker } from './Game1DNAMatchmaker.tsx';
import { Game2CodonChef } from './Game2CodonChef.tsx';
import { Game3PhyloTree } from './Game3PhyloTree.tsx';
import { Game4BioWordle } from './Game4BioWordle.tsx';

interface GameContainerProps {
    game: GameMetadata;
    translations: TranslationDictionary;
    onBack: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ game, translations, onBack }) => {
    const gameData = translations.games[game.id];

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="secondary" onClick={onBack}>
                    {translations.backToCrib}
                </Button>
            </div>

            {/* Main Game Area */}
            <div className={`flex-grow rounded-[3rem] border-8 border-white shadow-bubbly p-4 md:p-8 flex flex-col items-center justify-center text-center ${game.colorClass} relative overflow-hidden`}>
                
                {/* Decorative background elements */}
                <div className="absolute top-10 left-10 text-6xl opacity-20 rotate-12 pointer-events-none">{game.icon}</div>
                <div className="absolute bottom-10 right-10 text-8xl opacity-20 -rotate-12 pointer-events-none">{game.icon}</div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg w-full max-w-5xl z-10 min-h-[400px] flex flex-col">
                    {game.id === 'game1' ? (
                        <Game1DNAMatchmaker translations={translations.game1} />
                    ) : game.id === 'game2' ? (
                        <Game2CodonChef translations={translations.game2} />
                    ) : game.id === 'game3' ? (
                        <Game3PhyloTree translations={translations.game3} />
                    ) : game.id === 'game4' ? (
                        <Game4BioWordle translations={translations.game4} />
                    ) : (
                        // Fallback
                        <div className="flex flex-col items-center justify-center flex-grow">
                            <div className="text-8xl mb-6 animate-pulse">{game.icon}</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                                {gameData.title}
                            </h2>
                            <p className="text-xl text-slate-700 mb-8 font-medium">
                                {gameData.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
