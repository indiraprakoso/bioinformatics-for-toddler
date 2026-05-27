import { GameMetadata, Language, TranslationDictionary, AminoAcidDef, PhyloRoundDef } from './types.ts';

export const GAMES: GameMetadata[] = [
    { id: 'game1', colorClass: 'bg-pastel-mint', icon: '🧬' },
    { id: 'game2', colorClass: 'bg-pastel-purple', icon: '🍳' },
    { id: 'game3', colorClass: 'bg-pastel-pink', icon: '🧩' },
    { id: 'game4', colorClass: 'bg-pastel-blue', icon: '💻' },
];

export const AMINO_ACIDS: AminoAcidDef[] = [
    { id: 'met', codon: 'AUG' },
    { id: 'ala', codon: 'GCA' },
    { id: 'val', codon: 'GUG' },
    { id: 'lys', codon: 'AAA' },
    { id: 'gly', codon: 'GGU' },
    { id: 'pro', codon: 'CCA' },
    { id: 'ser', codon: 'UCA' },
    { id: 'thr', codon: 'ACA' },
];

export const ORGANISM_ICONS: Record<string, string> = {
    'human': '🧑‍🦱',
    'chimp': '🦧',
    'mouse': '🐁',
    'rat': '🐀',
    'chicken': '🐔'
};

export const PHYLO_ROUNDS: PhyloRoundDef[] = [
    {
        id: 'round1',
        organisms: ['human', 'chimp', 'mouse'],
        matrix: [
            [0, 2, 12],
            [2, 0, 12],
            [12, 12, 0]
        ],
        treeType: '3-unbalanced',
        validAnswers: [
            ['human', 'chimp', 'mouse'],
            ['chimp', 'human', 'mouse']
        ]
    },
    {
        id: 'round2',
        organisms: ['human', 'chimp', 'mouse', 'rat'],
        matrix: [
            [0, 2, 15, 15],
            [2, 0, 15, 15],
            [15, 15, 0, 3],
            [15, 15, 3, 0]
        ],
        treeType: '4-balanced',
        validAnswers: [
            ['human', 'chimp', 'mouse', 'rat'],
            ['chimp', 'human', 'mouse', 'rat'],
            ['human', 'chimp', 'rat', 'mouse'],
            ['chimp', 'human', 'rat', 'mouse'],
            ['mouse', 'rat', 'human', 'chimp'],
            ['rat', 'mouse', 'human', 'chimp'],
            ['mouse', 'rat', 'chimp', 'human'],
            ['rat', 'mouse', 'chimp', 'human']
        ]
    },
    {
        id: 'round3',
        organisms: ['human', 'chimp', 'mouse', 'chicken'],
        matrix: [
            [0, 2, 12, 25],
            [2, 0, 12, 25],
            [12, 12, 0, 25],
            [25, 25, 25, 0]
        ],
        treeType: '4-unbalanced',
        validAnswers: [
            ['human', 'chimp', 'mouse', 'chicken'],
            ['chimp', 'human', 'mouse', 'chicken']
        ]
    }
];

export const BIO_WORDS = [
    'CODON', 'AMINO', 'BLAST', 'FASTA', 'HELIX', 
    'CELLS', 'GENES', 'ALIGN', 'MOTIF', 'CLADE'
];

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
    en: {
        title: "Bioinformatics for Toddler 🧬👶",
        subtitle: "Welcome to the ultimate lab where we goo-goo-ga-ga our way through the omics world!\nDo you want to master bioinformatics?\nPlay this first, and let's see if you can handle a toddler-level game! 🤭",
        backToCrib: "🍼 Back to Crib",
        languageToggle: "Language",
        sound: "Sound Effects",
        games: {
            game1: { title: "DNA Matchmaker", description: "Match the A-T and C-G blocks before nap time!" },
            game2: { title: "Codon Chef", description: "Serve the correct amino acid orders." },
            game3: { title: "Phylo-Tree Architect", description: "Analyze DNA matrices to build evolutionary trees." },
            game4: { title: "Bio-Wordle", description: "Guess the secret bioinformatics word!" }
        },
        placeholderText: "Game logic goes here! Beep boop... 🤖",
        game1: {
            instructions: "Find the mutation in the Patient's DNA! Can you spot the difference?",
            normalDna: "Normal DNA",
            patientDna: "Patient DNA",
            gameOver: "Game Over!",
            score: "Score",
            lives: "Lives",
            playAgain: "Play Again"
        },
        game2: {
            instructions: "Cook the correct protein! Match the requested Amino Acid with its Codon.",
            peekTable: "👀 Peek Table",
            customerOrder: "Customer Orders",
            gameOver: "Kitchen Closed!",
            score: "Score",
            lives: "Lives",
            playAgain: "Cook Again",
            closeTable: "Close Table",
            codonTableTitle: "Codon Recipe Book",
            aminoAcids: {
                'met': 'Methionine',
                'ala': 'Alanine',
                'val': 'Valine',
                'lys': 'Lysine',
                'gly': 'Glycine',
                'pro': 'Proline',
                'ser': 'Serine',
                'thr': 'Threonine'
            }
        },
        game3: {
            instructions: "Analyze the Genetic Distance Matrix! Organisms with fewer differences share a closer branch. Tap or drag them to their correct places on the evolutionary tree.",
            checkAnswer: "✅ Verify Tree",
            gameOver: "Evolution Halted!",
            gameWon: "Master Architect!",
            score: "Score",
            lives: "Lives",
            playAgain: "Build Again",
            matrixTitle: "Genetic Distance Matrix",
            dropHere: "Drop Here",
            level: "Level",
            organisms: {
                'human': 'Human',
                'chimp': 'Chimpanzee',
                'mouse': 'Mouse',
                'rat': 'Rat',
                'chicken': 'Chicken'
            }
        },
        game4: {
            instructions: "Guess the 5-letter bioinformatics word in 6 tries.",
            gameOverWin: "Brilliant! You guessed it!",
            gameOverLose: "Out of tries! The word was:",
            playAgain: "Play Again",
            notEnoughLetters: "Not enough letters!",
            score: "Score",
            dictionary: {
                'CODON': 'A sequence of three nucleotides that forms a unit of genetic code.',
                'AMINO': 'Amino acids are the building blocks of proteins.',
                'BLAST': 'Basic Local Alignment Search Tool, an algorithm for comparing biological sequences.',
                'FASTA': 'A text-based format for representing either nucleotide sequences or amino acid sequences.',
                'HELIX': 'The twisted ladder shape of a DNA molecule (Double Helix).',
                'CELLS': 'The basic structural, functional, and biological units of all known organisms.',
                'GENES': 'Units of heredity which are transferred from a parent to offspring.',
                'ALIGN': 'Arranging sequences of DNA, RNA, or protein to identify regions of similarity.',
                'MOTIF': 'A short, recurring pattern in DNA or protein sequences that has a biological function.',
                'CLADE': 'A group of organisms believed to have evolved from a common ancestor.'
            }
        }
    },
    id: {
        title: "Bioinformatics for Toddler 🧬👶",
        subtitle: "Selamat datang di lab terbaik tempat kita menerobos dunia omics dengan gaya goo-goo-ga-ga!\nMau menguasai bioinformatika?\nMainkan ini dulu, dan kita lihat apakah kamu sanggup menghadapi game level balita! 🤭",
        backToCrib: "🍼 Kembali ke Boks Bayi",
        languageToggle: "Bahasa",
        sound: "Efek Suara",
        games: {
            game1: { title: "Pencocok DNA", description: "Cocokkan balok A-T dan C-G sebelum waktu tidur siang!" },
            game2: { title: "Koki Kodon", description: "Sajikan pesanan asam amino yang benar." },
            game3: { title: "Arsitek Pohon Evolusi", description: "Analisis matriks DNA untuk membangun pohon evolusi." },
            game4: { title: "Bio-Wordle", description: "Tebak kata rahasia bioinformatika!" }
        },
        placeholderText: "Logika permainan ditaruh di sini! Bip bop... 🤖",
        game1: {
            instructions: "Temukan mutasi pada DNA Pasien! Bisakah kamu melihat perbedaannya?",
            normalDna: "DNA Normal",
            patientDna: "DNA Pasien",
            gameOver: "Permainan Berakhir!",
            score: "Skor",
            lives: "Nyawa",
            playAgain: "Main Lagi"
        },
        game2: {
            instructions: "Masak protein yang benar! Cocokkan Asam Amino yang diminta dengan Kodonnya.",
            peekTable: "👀 Intip Tabel",
            customerOrder: "Pesanan Pelanggan",
            gameOver: "Dapur Ditutup!",
            score: "Skor",
            lives: "Nyawa",
            playAgain: "Masak Lagi",
            closeTable: "Tutup Tabel",
            codonTableTitle: "Buku Resep Kodon",
            aminoAcids: {
                'met': 'Metionin',
                'ala': 'Alanin',
                'val': 'Valin',
                'lys': 'Lisin',
                'gly': 'Glisin',
                'pro': 'Prolin',
                'ser': 'Serin',
                'thr': 'Treonin'
            }
        },
        game3: {
            instructions: "Analisis Matriks Jarak Genetik! Organisme dengan perbedaan lebih sedikit berada di cabang yang lebih dekat. Ketuk atau tarik mereka ke posisi pohon evolusi yang tepat.",
            checkAnswer: "✅ Verifikasi Pohon",
            gameOver: "Evolusi Terhenti!",
            gameWon: "Arsitek Ahli!",
            score: "Skor",
            lives: "Nyawa",
            playAgain: "Bangun Lagi",
            matrixTitle: "Matriks Jarak Genetik",
            dropHere: "Taruh Sini",
            level: "Level",
            organisms: {
                'human': 'Manusia',
                'chimp': 'Simpanse',
                'mouse': 'Tikus',
                'rat': 'Tikus Got',
                'chicken': 'Ayam'
            }
        },
        game4: {
            instructions: "Tebak kata bioinformatika 5 huruf dalam 6 kali percobaan.",
            gameOverWin: "Luar biasa! Kamu berhasil menebaknya!",
            gameOverLose: "Kesempatan habis! Kata rahasianya adalah:",
            playAgain: "Main Lagi",
            notEnoughLetters: "Huruf kurang!",
            score: "Skor",
            dictionary: {
                'CODON': 'Urutan tiga nukleotida yang membentuk unit kode genetik.',
                'AMINO': 'Asam amino adalah blok bangunan penyusun protein.',
                'BLAST': 'Algoritma untuk membandingkan sekuens biologis (DNA/Protein).',
                'FASTA': 'Format berbasis teks untuk merepresentasikan sekuens nukleotida atau asam amino.',
                'HELIX': 'Bentuk tangga berpilin dari molekul DNA (Heliks Ganda).',
                'CELLS': 'Unit struktural, fungsional, dan biologis dasar dari semua organisme.',
                'GENES': 'Unit pewarisan sifat yang diturunkan dari induk ke keturunannya.',
                'ALIGN': 'Menyusun sekuens DNA, RNA, atau protein untuk mengidentifikasi kemiripan.',
                'MOTIF': 'Pola pendek berulang pada sekuens DNA atau protein yang memiliki fungsi biologis.',
                'CLADE': 'Sekelompok organisme yang diyakini berevolusi dari nenek moyang yang sama.'
            }
        }
    }
};
