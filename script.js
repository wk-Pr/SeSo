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

let selected = [];
let correctCount = 0;
let mistakesCount = 0;
let score = 0;
let colorIndex = 0; // To cycle through colors for correct pairs
let startTime = null;
let currentDifficulty = "easy";
let leaderboard = []; // Array to store leaderboard data
let currentMode = null;

const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const elements = {
    menu: document.getElementById("menu"),
    gameContainer: document.getElementById("game-container"),
    gameArea: document.getElementById("game-area"),
    correctDisplay: document.getElementById("correct"),
    mistakesDisplay: document.getElementById("mistakes"),
    scoreDisplay: document.getElementById("score"),
    timeDisplay: document.getElementById("time"),
    difficultySelect: document.getElementById("difficulty"),
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
    exitButton: document.getElementById("exit"),
};

function updateScore() {
    score = correctCount * 10 - mistakesCount * 5;
    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;
    elements.scoreDisplay.textContent = score;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function handleButtonClick(button) {
    if (selected.length === 2) return;

    button.disabled = true;
    selected.push(button);

    if (selected.length === 2) checkMatch();
}

function checkMatch() {
    const [btn1, btn2] = selected;

    if (btn1.dataset.match === btn2.dataset.match) {
        correctCount++;
        score += 15;

        const currentColor = colors[colorIndex % colors.length];
        colorIndex++;

        btn1.style.backgroundColor = currentColor;
        btn2.style.backgroundColor = currentColor;
        btn1.style.color = "white";
        btn2.style.color = "white";
        btn1.disabled = true;
        btn2.disabled = true;
    } else {
        mistakesCount++;
        score -= 5;

        btn1.classList.add("wrong");
        btn2.classList.add("wrong");

        setTimeout(() => {
            btn1.classList.remove("wrong");
            btn2.classList.remove("wrong");
            btn1.disabled = false;
            btn2.disabled = false;
        }, 1000);
    }

    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;
    elements.scoreDisplay.textContent = score;

    selected = [];

    const totalWords = currentDifficulty === "easy" ? wordsEasy.length : wordsHard.length;

    if (correctCount === totalWords) {
        setTimeout(endGame, 500);
    }
}

function endGame() {
    const endTime = new Date();
    const totalTime = Math.floor((endTime - startTime) / 1000);

    // Add the player's performance to the leaderboard
    leaderboard.push({ score, time: totalTime, mistakes: mistakesCount });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time); // Sort by score, then time

    alert(`🎉 Well Done! Score: ${score}, Mistakes: ${mistakesCount}, Time Taken: ${totalTime} seconds`);
    showLeaderboard();
}

function startGame() {
    const gameMode = document.getElementById("game-mode").value;
    const difficulty = elements.difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    resetGame();
    currentMode = gameMode;

    elements.menu.classList.add("hidden");
    elements.gameContainer.classList.remove("hidden");

    if (gameMode === "matching") startMatchingGame(words);
    else if (gameMode === "say-the-word") startSayTheWordGame(words);
    else if (gameMode === "repeat-after-me") startRepeatAfterMeGame(words);
    else if (gameMode === "fill-in-the-blank") startFillInTheBlankGame(words);
    else if (gameMode === "build-the-sentence") startBuildTheSentenceGame(words);
}

function startMatchingGame(words) {
    const shuffled = shuffle([...words, ...words]);
    shuffled.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.english || word.arabic;
        button.addEventListener("click", () => handleMatching(word));
        elements.gameArea.appendChild(button);
    });
}

function handleMatching(word) {
    // Logic for matching game
}

function startSayTheWordGame(words) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const word = words[Math.floor(Math.random() * words.length)].english;

    recognition.start();
    recognition.onresult = (event) => {
        const speech = event.results[0][0].transcript.toLowerCase();
        if (speech === word.toLowerCase()) {
            correctCount++;
            alert("Correct!");
        } else {
            mistakesCount++;
            alert("Try Again!");
        }
        updateScore();
    };
}

function startRepeatAfterMeGame(words) {
    const word = words[Math.floor(Math.random() * words.length)].english;
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
    setTimeout(() => startSayTheWordGame(words), 3000);
}

function startFillInTheBlankGame(words) {
    const word = words[Math.floor(Math.random() * words.length)].english;
    const missing = word.replace(/./, "_");
    const userAnswer = prompt(`Complete the word: ${missing}`);
    if (userAnswer === word) {
        correctCount++;
        alert("Correct!");
    } else {
        mistakesCount++;
        alert(`Wrong! The correct word is ${word}`);
    }
    updateScore();
}

function startBuildTheSentenceGame(words) {
    const sentence = "I like apples";
    const userAnswer = prompt("Build the sentence: I ___ apples");
    if (userAnswer === "like") {
        correctCount++;
        alert("Correct!");
    } else {
        mistakesCount++;
        alert("Wrong!");
    }
    updateScore();
}
function showLeaderboard() {
    elements.gameContainer.classList.add("hidden");
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = ""; // Clear the table

    // Populate the leaderboard table
    leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.score}</td>
            <td>${entry.time}</td>
            <td>${entry.mistakes}</td>
        `;
        leaderboardBody.appendChild(row);
    });

    document.getElementById("leaderboard").classList.remove("hidden");
}


function resetGame() {
    elements.gameArea.innerHTML = "";
    correctCount = 0;
    mistakesCount = 0;
    score = 0;
    startTime = new Date();

    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;
    elements.scoreDisplay.textContent = score;
    elements.timeDisplay.textContent = 0;
}

function createButtons(words) {
    elements.buttonsContainer.innerHTML = "";

    const mixedWords = shuffle(
        [...words.map(w => ({ text: w.english, match: w.english })), 
        ...words.map(w => ({ text: w.arabic, match: w.english }))]
    );

    mixedWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.text;
        button.dataset.match = word.match;
        button.addEventListener("click", () => handleButtonClick(button));
        elements.buttonsContainer.appendChild(button);
    });
}

function exitToMenu() {
    elements.gameContainer.classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    elements.menu.classList.remove("hidden");
    resetGame();
}

// Event listeners
elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", startGame);
elements.exitButton.addEventListener("click", () => {
    elements.menu.classList.remove("hidden");
    elements.gameContainer.classList.add("hidden");
    resetGame();
});
document.getElementById("back-to-menu").addEventListener("click", exitToMenu);
