
/* =====================================================
   ENGLISH MADE EASY — JUEGOS AVANZADOS
   6 juegos, 10 retos por juego
   10 puntos por respuesta correcta
   ===================================================== */

const menu = document.getElementById("gamesMenu");
const area = document.getElementById("gameArea");
const content = document.getElementById("gameContent");
const totalPoints = document.getElementById("totalPoints");
const backButton = document.getElementById("backButton");

let points = 0;
let gameData = {};

function addPoints(amount) {
    points += amount;
    if (totalPoints) totalPoints.textContent = points;
}

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function heading(title, instructions) {
    return `
        <h2>${title}</h2>
        <p class="game-instructions">${instructions}</p>
        <p class="game-feedback" id="feedback" aria-live="polite"></p>
    `;
}

function feedback(message) {
    const element = document.getElementById("feedback");
    if (element) element.textContent = message;
}

function finishScreen(title, message, score, restartFunction) {
    content.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>Respuestas correctas:
        <strong>${score} de 10</strong></p>
        <p>Puntos ganados:
        <strong>${score * 10} de 100</strong></p>
        <button class="game-button" id="restartCurrent">
            Jugar otra vez
        </button>
    `;

    document.getElementById("restartCurrent")
        .addEventListener("click", restartFunction);
}

function openGame(name) {
    gameData = {};
    menu.hidden = true;
    area.hidden = false;

    const games = {
        memory: startMemory,
        order: startOrder,
        search: startSearch,
        quiz: startQuiz,
        complete: startComplete,
        guess: startGuess
    };

    if (games[name]) games[name]();

    area.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if (menu) {
    menu.addEventListener("click", event => {
        const card = event.target.closest("[data-game]");
        if (card) openGame(card.dataset.game);
    });
}

if (backButton) {
    backButton.addEventListener("click", () => {
        area.hidden = true;
        menu.hidden = false;
        content.innerHTML = "";
    });
}

/* =====================================================
   JUEGO 1 — MEMORY GAME: 10 PAREJAS
   ===================================================== */

const memoryPairs = [
    ["ENVIRONMENT", "MEDIO AMBIENTE"],
    ["KNOWLEDGE", "CONOCIMIENTO"],
    ["ACHIEVEMENT", "LOGRO"],
    ["RESPONSIBILITY", "RESPONSABILIDAD"],
    ["CHALLENGE", "DESAFÍO"],
    ["IMPROVE", "MEJORAR"],
    ["ALTHOUGH", "AUNQUE"],
    ["NEIGHBORHOOD", "BARRIO"],
    ["OPPORTUNITY", "OPORTUNIDAD"],
    ["CONFIDENCE", "CONFIANZA"]
];

function startMemory() {
    gameData = {
        cards: shuffle(memoryPairs.flatMap((pair, id) => [
            { id: id, word: pair[0] },
            { id: id, word: pair[1] }
        ])),
        first: null,
        matches: 0,
        attempts: 0,
        locked: false
    };

    content.innerHTML = heading(
        "🃏 Memory Game: Advanced Vocabulary",
        "Encuentra las 10 parejas relacionando cada palabra en inglés con su significado en español."
    ) + `
        <p>
            Intentos: <strong id="attempts">0</strong> |
            Parejas: <strong id="matches">0</strong> de 10
        </p>

        <div class="memory-grid" id="memoryGrid"></div>

        <button class="game-button" id="restartMemory">
            Reiniciar
        </button>
    `;

    const grid = document.getElementById("memoryGrid");

    gameData.cards.forEach((card, index) => {
        const button = document.createElement("button");

        button.className = "memory-card";
        button.textContent = "?";
        button.setAttribute("aria-label", "Tarjeta oculta");

        button.addEventListener("click", () => {
            flipMemory(index, button);
        });

        grid.appendChild(button);
    });

    document.getElementById("restartMemory")
        .addEventListener("click", startMemory);
}

function flipMemory(index, button) {
    if (
        gameData.locked ||
        button.disabled ||
        button.textContent !== "?"
    ) {
        return;
    }

    const card = gameData.cards[index];

    button.textContent = card.word;
    button.setAttribute("aria-label", card.word);

    if (!gameData.first) {
        gameData.first = { card, button };
        return;
    }

    const first = gameData.first;
    gameData.first = null;

    gameData.attempts++;

    document.getElementById("attempts").textContent =
        gameData.attempts;

    if (first.card.id === card.id) {
        first.button.classList.add("matched");
        button.classList.add("matched");

        first.button.disabled = true;
        button.disabled = true;

        gameData.matches++;

        document.getElementById("matches").textContent =
            gameData.matches;

        addPoints(10);

        if (gameData.matches === 10) {
            feedback(
                "¡Completaste las 10 parejas! " +
                "Ganaste 100 puntos. 🏆"
            );
        } else {
            feedback(
                "¡Pareja correcta! +10 puntos. Sigue buscando."
            );
        }
    } else {
        gameData.locked = true;

        feedback(
            "No coinciden. ¡Intenta recordar dónde está cada palabra!"
        );

        setTimeout(() => {
            if (
                !first.button.isConnected ||
                !button.isConnected
            ) {
                return;
            }

            first.button.textContent = "?";
            button.textContent = "?";

            first.button.setAttribute("aria-label", "Tarjeta oculta");
            button.setAttribute("aria-label", "Tarjeta oculta");

            gameData.locked = false;
        }, 1000);
    }
}

/* FIN DE LA PARTE 1 */

/* =====================================================
   JUEGO 2 — ORDENA LA ORACIÓN: 10 RETOS
   ===================================================== */

const orderSentences = [
    {
        words: ["Although", "it", "was", "raining", "we", "decided", "to", "continue", "the", "match"],
        translation: "Aunque estaba lloviendo, decidimos continuar el partido."
    },
    {
        words: ["If", "I", "study", "every", "day", "I", "will", "improve", "my", "English"],
        translation: "Si estudio todos los días, mejoraré mi inglés."
    },
    {
        words: ["She", "has", "been", "learning", "English", "since", "she", "was", "ten"],
        translation: "Ella ha estado aprendiendo inglés desde que tenía diez años."
    },
    {
        words: ["The", "students", "completed", "the", "project", "before", "the", "deadline"],
        translation: "Los estudiantes terminaron el proyecto antes de la fecha límite."
    },
    {
        words: ["Although", "the", "exam", "was", "difficult", "he", "answered", "every", "question"],
        translation: "Aunque el examen fue difícil, él respondió todas las preguntas."
    },
    {
        words: ["We", "should", "protect", "the", "environment", "because", "it", "is", "essential"],
        translation: "Deberíamos proteger el medio ambiente porque es esencial."
    },
    {
        words: ["My", "teacher", "explained", "the", "topic", "so", "that", "everyone", "could", "understand"],
        translation: "Mi profesor explicó el tema para que todos pudieran entenderlo."
    },
    {
        words: ["While", "I", "was", "doing", "my", "homework", "my", "friend", "called", "me"],
        translation: "Mientras hacía mi tarea, mi amigo me llamó."
    },
    {
        words: ["They", "will", "travel", "abroad", "if", "they", "save", "enough", "money"],
        translation: "Viajarán al extranjero si ahorran suficiente dinero."
    },
    {
        words: ["Despite", "feeling", "nervous", "she", "gave", "an", "excellent", "presentation"],
        translation: "A pesar de sentirse nerviosa, ella hizo una excelente exposición."
    }
];

function startOrder() {
    gameData = {
        round: 0,
        score: 0,
        selected: [],
        current: null,
        answered: false
    };

    showOrderRound();
}

function showOrderRound() {
    if (gameData.round >= orderSentences.length) {
        finishScreen(
            "🏆 ¡Terminaste!",
            "Completaste las 10 oraciones.",
            gameData.score,
            startOrder
        );
        return;
    }

    const sentence = orderSentences[gameData.round];

    gameData.current = sentence;
    gameData.selected = [];
    gameData.answered = false;

    const mixedWords = shuffle(sentence.words);

    content.innerHTML = heading(
        "🔤 Ordena la oración",
        "Organiza todas las palabras para construir una oración correcta. Fíjate en los conectores y los tiempos verbales."
    ) + `
        <p>Reto ${gameData.round + 1} de 10</p>

        <div id="wordOptions" class="word-options"></div>

        <h3>Tu oración:</h3>
        <div id="sentenceAnswer" class="sentence-answer">
            Selecciona las palabras...
        </div>

        <div class="game-actions">
            <button class="game-button" id="checkOrder">
                Comprobar
            </button>

            <button class="game-button" id="clearOrder">
                Borrar selección
            </button>
        </div>
    `;

    const options = document.getElementById("wordOptions");

    mixedWords.forEach(word => {
        const button = document.createElement("button");

        button.className = "word-chip";
        button.textContent = word;

        button.addEventListener("click", () => {
            if (gameData.answered || button.disabled) return;

            gameData.selected.push({
                word: word,
                button: button
            });

            button.disabled = true;
            updateSentenceAnswer();
        });

        options.appendChild(button);
    });

    document.getElementById("checkOrder")
        .addEventListener("click", checkOrder);

    document.getElementById("clearOrder")
        .addEventListener("click", () => {
            if (gameData.answered) return;

            gameData.selected = [];

            options.querySelectorAll("button").forEach(button => {
                button.disabled = false;
            });

            updateSentenceAnswer();
            feedback("");
        });
}

function updateSentenceAnswer() {
    const answer = document.getElementById("sentenceAnswer");

    if (!answer) return;

    answer.textContent = gameData.selected.length
        ? gameData.selected.map(item => item.word).join(" ")
        : "Selecciona las palabras...";
}

function checkOrder() {
    if (gameData.answered) return;

    const selectedWords = gameData.selected.map(item => item.word);
    const correctWords = gameData.current.words;

    const isCorrect =
        selectedWords.length === correctWords.length &&
        selectedWords.every((word, index) => word === correctWords[index]);

    if (!isCorrect) {
        feedback(
            "Todavía no está en el orden correcto. " +
            "Revisa la oración e inténtalo otra vez."
        );
        return;
    }

    gameData.answered = true;
    gameData.score++;

    addPoints(10);

    feedback(
        "¡Correcto! +10 puntos. Traducción: " +
        gameData.current.translation
    );

    const nextButton = document.createElement("button");

    nextButton.className = "game-button";
    nextButton.textContent =
        gameData.round === 9
            ? "Ver resultado"
            : "Siguiente oración →";

    nextButton.addEventListener("click", () => {
        gameData.round++;
        showOrderRound();
    });

    content.appendChild(nextButton);
}

/* FIN DE LA PARTE 2 */

/* =====================================================
   JUEGO 3 — WORD SEARCH: SOPA DE LETRAS REAL
   10 palabras de nivel bachillerato
   ===================================================== */

const searchWords = [
    "ENVIRONMENT",
    "KNOWLEDGE",
    "RESPONSIBILITY",
    "ACHIEVEMENT",
    "EDUCATION",
    "CHALLENGE",
    "CONFIDENCE",
    "CREATIVITY",
    "OPPORTUNITY",
    "COMMUNICATION"
];

const searchSize = 15;

const searchDirections = [
    [0, 1],   // Horizontal derecha
    [1, 0],   // Vertical abajo
    [1, 1],   // Diagonal abajo-derecha
    [0, -1],  // Horizontal izquierda
    [-1, 0],  // Vertical arriba
    [-1, -1], // Diagonal arriba-izquierda
    [1, -1],  // Diagonal abajo-izquierda
    [-1, 1]   // Diagonal arriba-derecha
];

function createWordSearch() {
    const grid = Array.from(
        { length: searchSize },
        () => Array(searchSize).fill("")
    );

    const placements = {};

    for (const word of shuffle(searchWords)) {
        let placed = false;

        for (let attempt = 0; attempt < 1000 && !placed; attempt++) {
            const direction = searchDirections[
                Math.floor(Math.random() * searchDirections.length)
            ];

            const dr = direction[0];
            const dc = direction[1];

            const row = Math.floor(Math.random() * searchSize);
            const col = Math.floor(Math.random() * searchSize);

            const endRow = row + dr * (word.length - 1);
            const endCol = col + dc * (word.length - 1);

            if (
                endRow < 0 || endRow >= searchSize ||
                endCol < 0 || endCol >= searchSize
            ) {
                continue;
            }

            let fits = true;

            for (let i = 0; i < word.length; i++) {
                const r = row + dr * i;
                const c = col + dc * i;

                if (grid[r][c] && grid[r][c] !== word[i]) {
                    fits = false;
                    break;
                }
            }

            if (fits) {
                const cells = [];

                for (let i = 0; i < word.length; i++) {
                    const r = row + dr * i;
                    const c = col + dc * i;

                    grid[r][c] = word[i];
                    cells.push(`${r}-${c}`);
                }

                placements[word] = cells;
                placed = true;
            }
        }

        if (!placed) {
            // Si una palabra no cabe, se vuelve a crear la cuadrícula.
            return createWordSearch();
        }
    }

    // Rellenar los espacios vacíos con letras aleatorias.
    for (let r = 0; r < searchSize; r++) {
        for (let c = 0; c < searchSize; c++) {
            if (!grid[r][c]) {
                grid[r][c] = String.fromCharCode(
                    65 + Math.floor(Math.random() * 26)
                );
            }
        }
    }

    return { grid, placements };
}

function startSearch() {
    const puzzle = createWordSearch();

    gameData = {
        grid: puzzle.grid,
        placements: puzzle.placements,
        found: [],
        anchor: null
    };

    content.innerHTML = heading(
        "🔎 Word Search — Advanced",
        "Encuentra las 10 palabras escondidas. Selecciona la primera letra y después la última. Pueden aparecer horizontalmente, verticalmente o en diagonal."
    ) + `
        <div class="search-layout">
            <div class="search-word-panel">
                <h3>📋 Palabras por encontrar</h3>
                <ul class="search-word-list" id="searchWordList"></ul>
                <p id="searchProgress">Encontradas: 0 de 10</p>
            </div>

            <div class="search-puzzle-wrap">
                <div
                    id="searchGrid"
                    class="word-grid real-word-grid"
                    role="grid"
                    aria-label="Sopa de letras"
                ></div>
            </div>
        </div>

        <p id="searchSelection">
            Selecciona la primera letra de una palabra.
        </p>

        <button class="game-button" id="clearSearch">
            Limpiar selección
        </button>

        <button class="game-button" id="restartSearch">
            Nueva sopa de letras
        </button>
    `;

    // Lista vertical: una palabra por línea.
    const list = document.getElementById("searchWordList");

    searchWords.forEach(word => {
        const li = document.createElement("li");

        li.id = "word-" + word;
        li.className = "search-word";
        li.textContent = word;

        list.appendChild(li);
    });

    // Crear la cuadrícula con letras separadas.
    const gridElement = document.getElementById("searchGrid");

    gridElement.style.gridTemplateColumns =
        `repeat(${searchSize}, minmax(0, 1fr))`;

    gameData.grid.forEach((row, r) => {
        row.forEach((letter, c) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "letter-cell";
            button.textContent = letter;
            button.dataset.row = r;
            button.dataset.col = c;

            button.setAttribute(
                "aria-label",
                `Fila ${r + 1}, columna ${c + 1}, letra ${letter}`
            );

            button.addEventListener("click", () => {
                selectSearchCell(r, c, button);
            });

            gridElement.appendChild(button);
        });
    });

    document.getElementById("clearSearch")
        .addEventListener("click", clearSearchSelection);

    document.getElementById("restartSearch")
        .addEventListener("click", startSearch);
}

function selectSearchCell(row, col, button) {
    if (button.classList.contains("found")) return;

    // Primer clic: elegir el comienzo de la palabra.
    if (!gameData.anchor) {
        clearSearchSelection();

        gameData.anchor = {
            row: row,
            col: col,
            button: button
        };

        button.classList.add("selected");

        document.getElementById("searchSelection").textContent =
            "Primera letra seleccionada. Ahora elige la última letra.";

        return;
    }

    // Segundo clic: elegir el final de la palabra.
    const start = gameData.anchor;

    const dr = row - start.row;
    const dc = col - start.col;

    const isStraight =
        dr === 0 ||
        dc === 0 ||
        Math.abs(dr) === Math.abs(dc);

    if (!isStraight || (dr === 0 && dc === 0)) {
        feedback(
            "Elige una línea horizontal, vertical o diagonal."
        );

        clearSearchSelection();
        return;
    }

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;

    const cells = [];

    for (let i = 0; i <= steps; i++) {
        const r = start.row + stepR * i;
        const c = start.col + stepC * i;

        const cell = document.querySelector(
            `#searchGrid button[data-row="${r}"][data-col="${c}"]`
        );

        if (cell) cells.push(cell);
    }

    const selectedWord = cells
        .map(cell => cell.textContent)
        .join("");

    const reversedWord = selectedWord
        .split("")
        .reverse()
        .join("");

    const foundWord = searchWords.find(word =>
        !gameData.found.includes(word) &&
        (word === selectedWord || word === reversedWord)
    );

    if (foundWord) {
        gameData.found.push(foundWord);

        cells.forEach(cell => {
            cell.classList.remove("selected");
            cell.classList.add("found");
        });

        const wordLabel = document.getElementById("word-" + foundWord);

        if (wordLabel) {
            wordLabel.classList.add("word-found");
        }

        addPoints(10);

        document.getElementById("searchProgress").textContent =
            `Encontradas: ${gameData.found.length} de 10`;

        if (gameData.found.length === 10) {
            feedback(
                "🏆 ¡Excelente! Encontraste las 10 palabras. " +
                "Ganaste 100 puntos."
            );

            document.getElementById("searchSelection").textContent =
                "¡Sopa de letras completada!";
        } else {
            feedback(`¡Encontraste ${foundWord}! +10 puntos 🎉`);

            document.getElementById("searchSelection").textContent =
                "Busca otra palabra de la lista.";
        }

        gameData.anchor = null;
    } else {
        feedback(
            "Esa selección no coincide con una palabra pendiente. " +
            "Inténtalo de nuevo."
        );

        clearSearchSelection();
    }
}

function clearSearchSelection() {
    if (gameData.anchor?.button) {
        gameData.anchor.button.classList.remove("selected");
    }

    document.querySelectorAll(
        "#searchGrid .letter-cell.selected"
    ).forEach(cell => {
        cell.classList.remove("selected");
    });

    gameData.anchor = null;

    const message = document.getElementById("searchSelection");

    if (message) {
        message.textContent =
            "Selecciona la primera letra de una palabra.";
    }
}

/* FIN DE LA PARTE 3 */

/* =====================================================
   JUEGO 4 — ENGLISH QUIZ: 10 PREGUNTAS
   Nivel bachillerato
   ===================================================== */

const quizQuestions = [
    {
        question: "If I _____ more time, I would learn another language.",
        options: ["have", "had", "will have", "am having"],
        answer: "had",
        explanation: "El segundo condicional usa If + pasado simple y would + verbo."
    },
    {
        question: "Choose the closest synonym of 'although'.",
        options: ["Because", "Even though", "Therefore", "As a result"],
        answer: "Even though",
        explanation: "'Although' y 'even though' significan 'aunque'."
    },
    {
        question: "She has lived in Bucaramanga _____ 2020.",
        options: ["for", "since", "during", "until"],
        answer: "since",
        explanation: "'Since' indica cuándo comenzó una acción; 'for' indica duración."
    },
    {
        question: "Choose the correct passive form: 'The students completed the project.'",
        options: [
            "The project completed the students.",
            "The project was completed by the students.",
            "The project is completing.",
            "The students were completed."
        ],
        answer: "The project was completed by the students.",
        explanation: "En pasado simple pasivo se utiliza was/were + participio pasado."
    },
    {
        question: "What does 'reliable' mean?",
        options: [
            "Difficult to understand",
            "Someone or something you can trust",
            "Very expensive",
            "Dangerous"
        ],
        answer: "Someone or something you can trust",
        explanation: "'Reliable' significa confiable."
    },
    {
        question: "He is interested _____ studying abroad.",
        options: ["on", "at", "in", "for"],
        answer: "in",
        explanation: "La expresión correcta es 'interested in'."
    },
    {
        question: "By the time we arrived, the film _____.",
        options: ["starts", "has started", "had started", "will start"],
        answer: "had started",
        explanation: "El pasado perfecto describe una acción que ocurrió antes de otra acción pasada."
    },
    {
        question: "Which sentence is grammatically correct?",
        options: [
            "She don't like science.",
            "She doesn't likes science.",
            "She doesn't like science.",
            "She not like science."
        ],
        answer: "She doesn't like science.",
        explanation: "Después de doesn't, el verbo principal se escribe en su forma base."
    },
    {
        question: "What does 'to achieve a goal' mean?",
        options: [
            "To avoid a goal",
            "To reach or accomplish a goal",
            "To change your opinion",
            "To lose an opportunity"
        ],
        answer: "To reach or accomplish a goal",
        explanation: "'Achieve' significa lograr o alcanzar."
    },
    {
        question: "He was exhausted; _____, he finished the assignment.",
        options: ["however", "because", "unless", "so that"],
        answer: "however",
        explanation: "'However' expresa contraste y significa 'sin embargo'."
    }
];

function startQuiz() {
    gameData = {
        round: 0,
        score: 0,
        answered: false
    };

    showQuizQuestion();
}

function showQuizQuestion() {
    if (gameData.round >= quizQuestions.length) {
        finishScreen(
            "⭐ ¡Quiz terminado!",
            "Terminaste el cuestionario de inglés avanzado.",
            gameData.score,
            startQuiz
        );

        return;
    }

    gameData.answered = false;

    const item = quizQuestions[gameData.round];

    content.innerHTML = heading(
        "⭐ English Quiz — Bachillerato",
        "Lee con atención. Cada pregunta correcta vale 10 puntos."
    ) + `
        <p>
            Pregunta ${gameData.round + 1} de
            ${quizQuestions.length}
        </p>

        <h3 class="quiz-question">${item.question}</h3>

        <div id="quizOptions" class="quiz-options"></div>

        <button class="game-button" id="nextQuiz" disabled>
            Siguiente pregunta →
        </button>
    `;

    const optionsContainer = document.getElementById("quizOptions");

    shuffle(item.options).forEach(option => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = option;

        button.addEventListener("click", () => {
            if (gameData.answered) return;

            gameData.answered = true;

            optionsContainer.querySelectorAll("button").forEach(btn => {
                btn.disabled = true;
            });

            if (option === item.answer) {
                button.classList.add("correct");

                gameData.score++;
                addPoints(10);

                feedback(
                    "¡Correcto! +10 puntos. " + item.explanation
                );
            } else {
                button.classList.add("incorrect");

                optionsContainer.querySelectorAll("button").forEach(btn => {
                    if (btn.textContent === item.answer) {
                        btn.classList.add("correct");
                    }
                });

                feedback(
                    "La respuesta correcta es: " +
                    item.answer + ". " + item.explanation
                );
            }

            document.getElementById("nextQuiz").disabled = false;
        });

        optionsContainer.appendChild(button);
    });

    document.getElementById("nextQuiz").addEventListener("click", () => {
        if (!gameData.answered) return;

        gameData.round++;
        showQuizQuestion();
    });
}

/* FIN DE LA PARTE 4 */

/* =====================================================
   JUEGO 5 — COMPLETE THE WORD
   10 retos de vocabulario avanzado
   ===================================================== */

const completeQuestions = [
    {
        word: "ENVIRONMENT",
        display: "E N V I R O N M E _ T",
        hint: "The natural world around us.",
        answer: "N",
        options: ["N", "M", "A"],
        translation: "medio ambiente"
    },
    {
        word: "KNOWLEDGE",
        display: "K N O W L E _ G E",
        hint: "Information and skills gained through learning.",
        answer: "D",
        options: ["D", "T", "B"],
        translation: "conocimiento"
    },
    {
        word: "RESPONSIBILITY",
        display: "R E S P O N S I B I L I T _",
        hint: "A duty or something you are expected to do.",
        answer: "Y",
        options: ["Y", "E", "I"],
        translation: "responsabilidad"
    },
    {
        word: "ACHIEVEMENT",
        display: "A C H I E V E M E _ T",
        hint: "Something important that you succeed in doing.",
        answer: "N",
        options: ["N", "M", "R"],
        translation: "logro"
    },
    {
        word: "OPPORTUNITY",
        display: "O P P O R T U N I T _",
        hint: "A chance to do something or improve your situation.",
        answer: "Y",
        options: ["Y", "E", "I"],
        translation: "oportunidad"
    },
    {
        word: "COMMUNICATION",
        display: "C O M M U N I C A T I O _",
        hint: "The act of sharing information or ideas with others.",
        answer: "N",
        options: ["N", "M", "R"],
        translation: "comunicación"
    },
    {
        word: "CONFIDENCE",
        display: "C O N F I D E N C _",
        hint: "The feeling that you can trust your own abilities.",
        answer: "E",
        options: ["E", "A", "I"],
        translation: "confianza"
    },
    {
        word: "CREATIVITY",
        display: "C R E A T I V I T _",
        hint: "The ability to produce original ideas.",
        answer: "Y",
        options: ["Y", "E", "I"],
        translation: "creatividad"
    },
    {
        word: "CHALLENGE",
        display: "C H A L L E N G _",
        hint: "A difficult task that tests your abilities.",
        answer: "E",
        options: ["E", "A", "O"],
        translation: "desafío"
    },
    {
        word: "EDUCATION",
        display: "E D U C A T I O _",
        hint: "The process of learning and gaining knowledge.",
        answer: "N",
        options: ["N", "M", "R"],
        translation: "educación"
    }
];

function startComplete() {
    gameData = {
        round: 0,
        score: 0,
        answered: false
    };

    showCompleteQuestion();
}

function showCompleteQuestion() {
    if (gameData.round >= completeQuestions.length) {
        finishScreen(
            "🧩 ¡Muy bien!",
            "Terminaste los 10 retos de vocabulario.",
            gameData.score,
            startComplete
        );

        return;
    }

    gameData.answered = false;

    const item = completeQuestions[gameData.round];

    content.innerHTML = heading(
        "🧩 Complete the Word",
        "Lee la pista en inglés y elige la letra que falta."
    ) + `
        <p>
            Reto ${gameData.round + 1} de
            ${completeQuestions.length}
        </p>

        <h3 class="quiz-question">${item.hint}</h3>

        <div class="missing-word">${item.display}</div>

        <p>Significado: ${item.translation}</p>

        <div id="completeOptions" class="quiz-options"></div>

        <button class="game-button" id="nextComplete" disabled>
            Siguiente palabra →
        </button>
    `;

    const optionsContainer =
        document.getElementById("completeOptions");

    shuffle(item.options).forEach(letter => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = letter;

        button.addEventListener("click", () => {
            if (gameData.answered) return;

            gameData.answered = true;

            optionsContainer.querySelectorAll("button").forEach(btn => {
                btn.disabled = true;
            });

            if (letter === item.answer) {
                button.classList.add("correct");

                gameData.score++;
                addPoints(10);

                feedback(
                    `¡Correcto! ${item.word} significa ` +
                    `"${item.translation}". +10 puntos.`
                );
            } else {
                button.classList.add("incorrect");

                optionsContainer.querySelectorAll("button").forEach(btn => {
                    if (btn.textContent === item.answer) {
                        btn.classList.add("correct");
                    }
                });

                feedback(
                    `La letra correcta era ${item.answer}. ` +
                    `La palabra completa es ${item.word}.`
                );
            }

            document.getElementById("nextComplete").disabled = false;
        });

        optionsContainer.appendChild(button);
    });

    document.getElementById("nextComplete")
        .addEventListener("click", () => {
            if (!gameData.answered) return;

            gameData.round++;
            showCompleteQuestion();
        });
}

/* FIN DE LA PARTE 5 */

/* =====================================================
   JUEGO 6 — GUESS THE WORD
   10 retos de vocabulario avanzado
   ===================================================== */

const guessQuestions = [
    {
        hint: "The natural world, including air, water, plants, and animals.",
        options: [
            "Environment",
            "Achievement",
            "Neighborhood",
            "Confidence"
        ],
        answer: "Environment",
        translation: "medio ambiente"
    },
    {
        hint: "The ability to create new ideas or original things.",
        options: [
            "Creativity",
            "Responsibility",
            "Education",
            "Communication"
        ],
        answer: "Creativity",
        translation: "creatividad"
    },
    {
        hint: "A difficult situation that tests your skills or patience.",
        options: [
            "Opportunity",
            "Challenge",
            "Knowledge",
            "Achievement"
        ],
        answer: "Challenge",
        translation: "desafío"
    },
    {
        hint: "Facts, information, and skills acquired through experience or study.",
        options: [
            "Knowledge",
            "Confidence",
            "Environment",
            "Communication"
        ],
        answer: "Knowledge",
        translation: "conocimiento"
    },
    {
        hint: "A chance to do something or improve your situation.",
        options: [
            "Responsibility",
            "Opportunity",
            "Neighborhood",
            "Achievement"
        ],
        answer: "Opportunity",
        translation: "oportunidad"
    },
    {
        hint: "The process of sharing ideas, messages, or information with others.",
        options: [
            "Communication",
            "Creativity",
            "Confidence",
            "Education"
        ],
        answer: "Communication",
        translation: "comunicación"
    },
    {
        hint: "A duty or task that you are expected to take care of.",
        options: [
            "Responsibility",
            "Achievement",
            "Challenge",
            "Knowledge"
        ],
        answer: "Responsibility",
        translation: "responsabilidad"
    },
    {
        hint: "The belief that you can do something successfully.",
        options: [
            "Confidence",
            "Environment",
            "Opportunity",
            "Education"
        ],
        answer: "Confidence",
        translation: "confianza"
    },
    {
        hint: "Something important that you have succeeded in doing.",
        options: [
            "Achievement",
            "Challenge",
            "Communication",
            "Neighborhood"
        ],
        answer: "Achievement",
        translation: "logro"
    },
    {
        hint: "The process of teaching, learning, and developing knowledge.",
        options: [
            "Education",
            "Creativity",
            "Confidence",
            "Environment"
        ],
        answer: "Education",
        translation: "educación"
    }
];

function startGuess() {
    gameData = {
        round: 0,
        score: 0,
        answered: false
    };

    showGuessQuestion();
}

function showGuessQuestion() {
    if (gameData.round >= guessQuestions.length) {
        finishScreen(
            "🎯 ¡Juego terminado!",
            "Completaste los 10 retos de vocabulario.",
            gameData.score,
            startGuess
        );

        return;
    }

    gameData.answered = false;

    const item = guessQuestions[gameData.round];

    content.innerHTML = heading(
        "🎯 Guess the Word — Advanced",
        "Lee la pista en inglés y selecciona la palabra que mejor corresponde."
    ) + `
        <p>
            Reto ${gameData.round + 1} de
            ${guessQuestions.length}
        </p>

        <div class="guess-hint">
            💡 ${item.hint}
        </div>

        <div id="guessOptions" class="quiz-options"></div>

        <button class="game-button" id="nextGuess" disabled>
            Siguiente reto →
        </button>
    `;

    const optionsContainer =
        document.getElementById("guessOptions");

    shuffle(item.options).forEach(option => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = option;

        button.addEventListener("click", () => {
            if (gameData.answered) return;

            gameData.answered = true;

            optionsContainer.querySelectorAll("button").forEach(btn => {
                btn.disabled = true;
            });

            if (option === item.answer) {
                button.classList.add("correct");

                gameData.score++;
                addPoints(10);

                feedback(
                    `¡Correcto! ${item.answer} significa ` +
                    `"${item.translation}". +10 puntos.`
                );
            } else {
                button.classList.add("incorrect");

                optionsContainer.querySelectorAll("button").forEach(btn => {
                    if (btn.textContent === item.answer) {
                        btn.classList.add("correct");
                    }
                });

                feedback(
                    `La respuesta correcta era ${item.answer}. ` +
                    `Significa "${item.translation}".`
                );
            }

            document.getElementById("nextGuess").disabled = false;
        });

        optionsContainer.appendChild(button);
    });

    document.getElementById("nextGuess")
        .addEventListener("click", () => {
            if (!gameData.answered) return;

            gameData.round++;
            showGuessQuestion();
        });
}

/* =====================================================
   FIN DEL ARCHIVO JUEGOS.JS
   ===================================================== */
