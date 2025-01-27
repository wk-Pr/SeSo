const wordsEasy = [
    { english: "Always", arabic: "دائماً" },
    { english: "Find", arabic: "يجد" },
    { english: "Choose", arabic: "يختار" },
    { english: "Fix", arabic: "يصلِّح" },
    { english: "Paint", arabic: "يرسم, يدهن" },
    { english: "Practice", arabic: "يتدرب على" },
    { english: "Safe", arabic: "آمن" },
    { english: "Club", arabic: "نادٍ" },
    { english: "Or", arabic: "أو" },
    { english: "Problem", arabic: "مشكلة" },
    { english: "Table Tennis", arabic: "تنس طاولة" },
    { english: "Use", arabic: "يستعمل" },
    { english: "Olympic Games", arabic: "الألعاب الأولمبية" },
    { english: "Was", arabic: "كان" },
    { english: "Need", arabic: "يحتاج إلى" },
    { english: "Hard", arabic: "صعب" },
    { english: "Country", arabic: "دولة" },
    { english: "Hour", arabic: "ساعة (زمنية)" },
    { english: "How", arabic: "كيف" },
    { english: "First", arabic: "أوّل" },
    { english: "Place", arabic: "مكان" },
    { english: "Move", arabic: "يتحرك , يحرَك" },
    { english: "Them", arabic: "إيّاهم , إياهنّ لهم" },
    { english: "Easy", arabic: "سَهْل" },
    { english: "Plate", arabic: "صحن" },
    { english: "Tomorrow", arabic: "غدًا" },
    { english: "Race", arabic: "سباق" },
];

const wordsHard = [
    { english: "Many", arabic: "كثير" },
    { english: "Prepare", arabic: "يحضّر, يعدّ" },
    { english: "Later", arabic: "فيما بعد, لاحقًا" },
    { english: "Medal", arabic: "مدالية" },
    { english: "Because", arabic: "لأن" },
    { english: "Again", arabic: "مرة أخرى" },
    { english: "(be) called", arabic: "يُدعى" },
    { english: "Artist", arabic: "فنّان" },
    { english: "Interesting", arabic: "مثير للاهتمام" },
];

const elements = {
    menu: document.getElementById("menu"),
    gameContainer: document.getElementById("game-container"),
    gameArea: document.getElementById("game-area"),
    correctDisplay: document.getElementById("correct"),
    mistakesDisplay: document.getElementById("mistakes"),
    scoreDisplay: document.getElementById("score"),
    timeDisplay: document.getElementById("time"),
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
    exitButton: document.getElementById("exit"),
};

let correctCount = 0;
let mistakesCount = 0;
let score = 0;
let startTime = null;
let selectedButtons = [];
let currentDifficulty = "easy";
let colorIndex = 0;
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A1FF33"]; //

function resetGame() {
    correctCount = 0;
    mistakesCount = 0;
    score = 0;
    selectedButtons = [];
    startTime = new Date();
    colorIndex = 0;

    elements.correctDisplay.textContent = "0";
    elements.mistakesDisplay.textContent = "0";
    elements.scoreDisplay.textContent = "0";
    elements.timeDisplay.textContent = "0";

    elements.gameArea.innerHTML = "";
}

function updateScore() {
    score = correctCount * 10 - mistakesCount * 5;
    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;
    elements.scoreDisplay.textContent = score;

    const timeTaken = Math.floor((new Date() - startTime) / 1000);
    elements.timeDisplay.textContent = timeTaken;
}


function updateDescription() {
    const gameMode = document.getElementById("game-mode").value;
    const descriptions = {
        matching: "Match English and Arabic words. <br> طابق الكلمات الإنجليزية والعربية.",
        "say-the-word": "Say the word aloud. <br> انطق الكلمة بصوت عالٍ.",
        "repeat-after-me": "Repeat after me. <br> كرر بعدي.",
        "fill-in-the-blank": "Fill in the blank. <br> أكمل الكلمة.",
        "build-the-sentence": "Build the sentence. <br> كوّن الجملة.",
    };
    document.getElementById("game-description").innerHTML =
        descriptions[gameMode] || "Choose a game mode.";
}

function startMatchingGame() {
    const difficulty = document.getElementById("difficulty").value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    const mixedWords = shuffle(
        [...words.map(w => ({ text: w.english, match: w.english })), 
         ...words.map(w => ({ text: w.arabic, match: w.english }))]
    );

    elements.gameArea.innerHTML = "";

    mixedWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.text;
        button.dataset.match = word.match;
        button.classList.add("game-button");
        button.addEventListener("click", () => handleMatchClick(button));
        elements.gameArea.appendChild(button);
    });
}

function handleMatchClick(button) {
    if (selectedButtons.length === 2) return; //

    if (!selectedButtons.includes(button)) {
        button.classList.add("selected"); //
        selectedButtons.push(button);
    }

    if (selectedButtons.length === 2) {
        const [btn1, btn2] = selectedButtons;

        if (btn1.dataset.match === btn2.dataset.match) {
            correctCount++;
            const currentColor = colors[colorIndex % colors.length];
            colorIndex++;

            // 
            btn1.style.backgroundColor = currentColor;
            btn2.style.backgroundColor = currentColor;
            btn1.style.color = "white";
            btn2.style.color = "white";
            btn1.classList.remove("selected");
            btn2.classList.remove("selected");
            btn1.disabled = true;
            btn2.disabled = true;
        } else {
            mistakesCount++;

            // 
            btn1.classList.add("wrong");
            btn2.classList.add("wrong");

            setTimeout(() => {
                btn1.classList.remove("wrong", "selected");
                btn2.classList.remove("wrong", "selected");
                btn1.style.backgroundColor = ""; // 
                btn2.style.backgroundColor = ""; // 
                btn1.disabled = false;
                btn2.disabled = false;
            }, 1000);
        }

        selectedButtons = []; // 
        updateScore(); //
    }
}


function startSayTheWordGame() {
    const word = getRandomWord();
    const translation = word.arabic;

    // Display the word and its translation
    elements.gameArea.innerHTML = `
        <p class="game-word">Say this word: <strong>${word.english}</strong></p>
        <p class="game-translation">Translation: <strong>${translation}</strong></p>
        <div id="wave-container">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
        </div>
    `;

    const utterance = new SpeechSynthesisUtterance(word.english);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Please try another browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    // Show wave animation when the microphone is active
    const waveContainer = document.getElementById("wave-container");
    waveContainer.classList.add("listening");

    recognition.start();

    recognition.onstart = () => {
        waveContainer.classList.add("listening");
    };

    recognition.onend = () => {
        waveContainer.classList.remove("listening");
    };

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript.toLowerCase().trim();
        const correctWord = word.english.toLowerCase().trim();

        if (normalizeString(userSpeech) === normalizeString(correctWord)) {
            correctCount++;
            alert("✅ Correct! Well done!");
        } else {
            mistakesCount++;
            alert(`❌ Incorrect! The correct word was: "${word.english}".`);
        }

        updateScore();
        setTimeout(startSayTheWordGame, 2000);
    };

    recognition.onerror = (error) => {
        alert("⚠️ Error with microphone or recognition. Please try again.");
        waveContainer.classList.remove("listening");
        console.error("Recognition error:", error);
    };
}

function normalizeString(input) {
    return input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}



function startRepeatAfterMeGame() {
    const word = getRandomWord();
    elements.gameArea.innerHTML = `<p class="game-word">Repeat after me: <strong>${word.english}</strong></p>`;
    const utterance = new SpeechSynthesisUtterance(word.english);
    speechSynthesis.speak(utterance);
}

function startFillInTheBlankGame() {
    const word = getRandomWord();
    const missing = word.english.replace(/[a-zA-Z]/g, (char, index) => (index % 2 === 0 ? char : "_"));
    elements.gameArea.innerHTML = `<p class="game-word">Complete the word: <strong>${missing}</strong></p>`;
}

function startBuildTheSentenceGame() {
    const sentence = "I like apples";
    const shuffled = shuffle(sentence.split(" "));
    elements.gameArea.innerHTML = `<p class="game-word">Arrange these words: <strong>${shuffled.join(" ")}</strong></p>`;
}

function startSpeechGame() {
    const word = getRandomWord();
    const translation = word.arabic;

    elements.gameArea.innerHTML = `
        <p class="game-word">Say this word: <strong>${word.english}</strong></p>
        <p class="game-translation">Translation: ${translation}</p>
    `;

    const utterance = new SpeechSynthesisUtterance(word.english);
    speechSynthesis.speak(utterance);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript.toLowerCase();
        if (userSpeech === word.english.toLowerCase()) {
            correctCount++;
            alert("Correct!");
        } else {
            mistakesCount++;
            alert(`Incorrect! The correct word was "${word.english}".`);
        }
        updateScore();
    };

    recognition.onerror = () => {
        alert("Error with microphone. Please try again.");
    };
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getRandomWord() {
    const difficulty = document.getElementById("difficulty").value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;
    return words[Math.floor(Math.random() * words.length)];
}


elements.startButton.addEventListener("click", () => {
    resetGame();
    elements.menu.classList.add("hidden");
    elements.gameContainer.classList.remove("hidden");
    const gameMode = document.getElementById("game-mode").value;
    if (gameMode === "matching") startMatchingGame();
    else if (gameMode === "say-the-word") startSayTheWordGame();
    else if (gameMode === "repeat-after-me") startRepeatAfterMeGame();
    else if (gameMode === "fill-in-the-blank") startFillInTheBlankGame();
    else if (gameMode === "build-the-sentence") startBuildTheSentenceGame();
});
elements.restartButton.addEventListener("click", () => {
    resetGame();
    const gameMode = document.getElementById("game-mode").value;
    if (gameMode === "matching") startMatchingGame();
    else if (gameMode === "say-the-word") startSayTheWordGame();
    else if (gameMode === "repeat-after-me") startRepeatAfterMeGame();
    else if (gameMode === "fill-in-the-blank") startFillInTheBlankGame();
    else if (gameMode === "build-the-sentence") startBuildTheSentenceGame();
});
elements.exitButton.addEventListener("click", () => {
    elements.menu.classList.remove("hidden");
    elements.gameContainer.classList.add("hidden");
    resetGame();
});
