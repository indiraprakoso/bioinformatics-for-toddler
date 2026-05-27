export type Language = 'en' | 'id';

export type GameId = 'game1' | 'game2' | 'game3' | 'game4';

export interface GameMetadata {
    id: GameId;
    colorClass: string;
    icon: string;
}

export interface Game1Translations {
    instructions: string;
    normalDna: string;
    patientDna: string;
    gameOver: string;
    score: string;
    lives: string;
    playAgain: string;
}

export interface Game2Translations {
    instructions: string;
    peekTable: string;
    customerOrder: string;
    gameOver: string;
    score: string;
    lives: string;
    playAgain: string;
    closeTable: string;
    codonTableTitle: string;
    aminoAcids: Record<string, string>;
}

export interface Game3Translations {
    instructions: string;
    checkAnswer: string;
    gameOver: string;
    gameWon: string;
    score: string;
    lives: string;
    playAgain: string;
    matrixTitle: string;
    dropHere: string;
    level: string;
    organisms: Record<string, string>;
}

export interface Game4Translations {
    instructions: string;
    gameOverWin: string;
    gameOverLose: string;
    playAgain: string;
    notEnoughLetters: string;
    score: string;
    dictionary: Record<string, string>;
}

export interface TranslationDictionary {
    title: string;
    subtitle: string;
    backToCrib: string;
    languageToggle: string;
    sound: string;
    games: Record<GameId, { title: string; description: string }>;
    placeholderText: string;
    game1: Game1Translations;
    game2: Game2Translations;
    game3: Game3Translations;
    game4: Game4Translations;
}

export interface AminoAcidDef {
    id: string;
    codon: string;
}

export type TreeType = '3-unbalanced' | '4-balanced' | '4-unbalanced';

export interface PhyloRoundDef {
    id: string;
    organisms: string[];
    matrix: number[][];
    treeType: TreeType;
    validAnswers: string[][];
}
