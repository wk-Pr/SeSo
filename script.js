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

const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const elements = {
    menu: document.getElementById("menu"),
    gameContainer: document.getElementById("game-container"),
    buttonsContainer: document.getElementById("buttons"),
    correctDisplay: document.getElementById("correct"),
    mistakesDisplay: document.getElementById("mistakes"),
    scoreDisplay: document.getElementById("score"),
    timeDisplay: document.getElementById("time"),
    difficultySelect: document.getElementById("difficulty"),
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
    exitButton: document.getElementById("exit"),
};

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
    resetGame();

    if (gameMode === "matching") {
        startMatchingGame();
    } else if (gameMode === "say-the-word") {
        startSayTheWordGame();
    } else if (gameMode === "repeat-after-me") {
        startRepeatAfterMeGame();
    } else if (gameMode === "fill-in-the-blank") {
        startFillInTheBlankGame();
    } else if (gameMode === "build-the-sentence") {
        startBuildTheSentenceGame();
    }
}

function startMatchingGame() {
    const difficulty = elements.difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    elements.menu.classList.add("hidden");
    elements.gameContainer.classList.remove("hidden");

    createButtons(words);
}

function startSayTheWordGame() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const wordToSpeak = "Apple";

    recognition.onstart = () => alert(`Say the word: "${wordToSpeak}"`);
    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript.toLowerCase();
        alert(userSpeech === wordToSpeak.toLowerCase() ? "Correct!" : `Wrong! The word is "${wordToSpeak}"`);
    };

    recognition.start();
}

function startRepeatAfterMeGame() {
    const wordToSpeak = "Banana";
    const utterance = new SpeechSynthesisUtterance(wordToSpeak);
    utterance.onend = () => startSayTheWordGame();
    speechSynthesis.speak(utterance);
}

function startFillInTheBlankGame() {
    const word = "A_ple";
    const missingLetter = "p";
    const userInput = prompt(`Complete the word: ${word}`);

    if (userInput === missingLetter) {
        alert("Correct!");
    } else {
        alert(`Wrong! The correct word is "Apple".`);
    }
}

function startBuildTheSentenceGame() {
    const sentence = "I like apples";
    const userSentence = prompt("Build the sentence: I ___ apples");

    if (userSentence === "like") {
        alert("Correct!");
    } else {
        alert(`Wrong! The correct sentence is "${sentence}".`);
    }
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
    elements.buttonsContainer.innerHTML = "";
    correctCount = 0;
    mistakesCount = 0;
    score = 0;
    colorIndex = 0;

    elements.correctDisplay.textContent = "0";
    elements.mistakesDisplay.textContent = "0";
    elements.scoreDisplay.textContent = "0";
    elements.timeDisplay.textContent = "0";
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
elements.exitButton.addEventListener("click", exitToMenu);
document.getElementById("back-to-menu").addEventListener("click", exitToMenu);
