# bioinformatics-for-toddler-game
> **"Welcome to the ultimate lab where we goo-goo-ga-ga our way through the omics world! Do you want to master bioinformatics? Play this first, and let's see if you can handle a toddler-level game!"**

---

## 🚀 About The Game
Bioinformatics is an emerging, powerhouse field in biology—but explaining it to beginners or high school students can be quite a challenge. Traditional learning often gets bogged down in heavy theory. 

**Bioinformatics for Toddler** is a lightweight, single-page web application developed for the **#JuaraVibeCoding** initiative. It leverages gamification and interactive UI to break down complex genomic and evolutionary concepts into bite-sized, playful, yet highly competitive mini-games. Despite the sarcastic "toddler" theme, the puzzles are designed to genuinely challenge a high schooler's (or even an adult's!) logic.

## 🌍 Features
* **Bilingual Support:** Easily toggle between **English** and **Bahasa Indonesia** seamlessly at any time without losing your current session.
* **Pure Client-Side App:** Built completely using vanilla frontend web technologies. It runs fully inside the browser, making it incredibly lightweight and cost-efficient to host.
* **Immersive Audio:** Integrated with Web Audio API for interactive, retro arcade-style sound effects.

---

## 🎮 The Mini-Games

### 1. 🔍 DNA Matchmaker (Mutation Detective)
* **Concept:** Sequence Alignment & Genetic Mutations.
* **Gameplay:** Players compare a "Normal DNA" sequence against a mutated "Patient DNA". The goal is to detect and click the exact starting point of the mutation (Substitution, Insertion, or Deletion) before the timer runs out.

### 🍳 2. Codon Chef (Protein Maker)
* **Concept:** DNA/RNA Translation.
* **Gameplay:** "Serve the correct amino acid orders!" Customers place orders for specific amino acids, and the player must quickly match them with the correct 3-letter RNA codon button. Features a toggleable "Codon Table" cheat sheet.

### 🌳 3. Phylo-Tree Architect (DNA Matrix Puzzle)
* **Concept:** Phylogenetics & Genetic Distance.
* **Gameplay:** No easy mode here! Players are given a real-life style **Genetic Distance Matrix Table**. They must analyze the coordinates of mutation counts to map out and arrange organisms onto the correct branches of an evolutionary tree.

### 🔠 4. Bio-Wordle (Pocket Glossary)
* **Concept:** Bioinformatics Scientific Vocabulary.
* **Gameplay:** A clone of the famous Wordle game mechanics. Players have 6 tries to guess 5-letter bioinformatics terms (e.g., `CODON`, `GENOM`, `AMINO`, `BLAST`, `FASTA`). Winning unlocks a quick, educational pop-up definition of the term.

---

## 🛠️ Tech Stack & Architecture
This project is engineered to be as minimalist and robust as possible, built under the **Vibe Coding** philosophy:
* **Frontend:** HTML5, CSS3 (Modern pastel/bubbly responsive design), Vanilla JavaScript (ES6+).
* **Audio:** Web Audio API (No external heavy audio asset files needed).
* **Fonts:** Google Fonts (Quicksand / Nunito).
* **Deployment:** Google Cloud Run (Optimized single-file container distribution).

## 🏃‍♂️ How to Run Locally
Since this entire platform is bundled into a single HTML file, running it is incredibly simple:

1. Clone this repository:
```bash
   git clone https://github.com/indiraprakoso/bioinformatics-for-toddler.git
   cd bioinformatics-for-toddler
```

Step 2: Create a Local Environment File
The backend expects a local environment file named .env.local inside the backend directory to initialize route proxies properly. Run the appropriate command for your OS to generate this empty file:

Windows (Command Prompt):
```DOS
type null > backend\.env.local
```

Linux / macOS / Git Bash:
```Bash
touch backend/.env.local
```

Step 3: Install Dependencies
Thanks to NPM Workspaces, you don't need to navigate into separate frontend or backend folders. Simply run this command in the root directory (the main folder):
```Bash
npm install
```

Step 4: Launch the Application
Start both the backend server and the frontend development server simultaneously with a single command:
```Bash
npm run dev
```

Once successful, your terminal will output the active local servers:
Frontend running at: http://localhost:5173/ & Backend listening at: http://localhost:8080/

Open your browser, navigate to http://localhost:5173/, and enjoy the game!
