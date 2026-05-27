import React, { useState, useMemo } from 'react';
import { Language, GameId } from './types.ts';
import { TRANSLATIONS, GAMES } from './constants.ts';
import { GameCard } from './components/GameCard.tsx';
import { GameContainer } from './components/GameContainer.tsx';
import { playPopSound, toggleSfx } from './services/audioService.ts';

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [currentGameId, setCurrentGameId] = useState<GameId | null>(null);
    
    // Audio States
    const [isSoundOn, setIsSoundOn] = useState(true);

    const t = useMemo(() => TRANSLATIONS[language], [language]);

    const handleLanguageToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        playPopSound();
        setLanguage(e.target.value as Language);
    };

    const handleSoundToggle = () => {
        const newState = !isSoundOn;
        setIsSoundOn(newState);
        toggleSfx(newState);
        if (newState) {
            // Play a test sound immediately when turning on
            setTimeout(playPopSound, 50); 
        }
    };

    const handleGameSelect = (id: GameId) => {
        setCurrentGameId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToDashboard = () => {
        setCurrentGameId(null);
    };

    // Render Game View
    if (currentGameId) {
        const gameMeta = GAMES.find(g => g.id === currentGameId);
        if (gameMeta) {
            return (
                <GameContainer 
                    game={gameMeta} 
                    translations={t} 
                    onBack={handleBackToDashboard} 
                />
            );
        }
    }

    // Render Dashboard View
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left w-full overflow-hidden">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-4 drop-shadow-sm whitespace-nowrap">
                        {t.title}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed whitespace-pre-line">
                        {t.subtitle}
                    </p>
                </div>

                {/* Controls Container */}
                <div className="flex items-center gap-3 shrink-0">
                    
                    {/* Sound Toggle */}
                    <button 
                        onClick={handleSoundToggle} 
                        className={`w-12 h-12 flex items-center justify-center text-xl bg-white border-4 rounded-full shadow-bubbly hover:shadow-bubbly-hover transition-all active:scale-95 ${isSoundOn ? 'border-pastel-blue' : 'border-slate-300 opacity-70'}`}
                        title={t.sound}
                        aria-label={t.sound}
                    >
                        {isSoundOn ? '🔊' : '🔇'}
                    </button>

                    {/* Language Toggle */}
                    <div className="relative">
                        <select 
                            value={language}
                            onChange={handleLanguageToggle}
                            className="appearance-none bg-white border-4 border-pastel-yellow text-slate-700 font-bold py-2 pl-4 pr-10 rounded-full shadow-bubbly hover:shadow-bubbly-hover focus:outline-none focus:ring-4 focus:ring-pastel-yellow/50 cursor-pointer transition-all h-12"
                            aria-label={t.languageToggle}
                        >
                            <option value="en">🇬🇧 EN</option>
                            <option value="id">🇮🇩 ID</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Games Grid */}
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {GAMES.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            title={t.games[game.id].title}
                            description={t.games[game.id].description}
                            onClick={() => handleGameSelect(game.id)}
                        />
                    ))}
                </div>
            </main>

            {/* Footer decoration */}
            <footer className="mt-16 text-center text-slate-400 font-medium pb-8">
                <p>
                    Made by <a href="https://www.linkedin.com/in/indiraprakoso/" target="_blank" rel="noopener noreferrer" className="hover:text-pastel-blue transition-colors underline decoration-dotted">Indira Prakoso</a> x AI Assistant (Gemini) | 
                    Bioinformatics ala Gen Z (<a href="https://www.instagram.com/biozee.id" target="_blank" rel="noopener noreferrer" className="hover:text-pastel-pink transition-colors underline decoration-dotted">@biozee.id</a>)
                </p>
            </footer>
        </div>
    );
};

export default App;
