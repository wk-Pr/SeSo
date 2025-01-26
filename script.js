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
let colorIndex = 0; // To cycle through colors for correct pairs
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
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
    exitButton: document.getElementById("exit"),
};

let correctCount = 0;
let mistakesCount = 0;
let score = 0;
let startTime = null;

function resetGame() {
    correctCount = 0;
    mistakesCount = 0;
    score = 0;
    startTime = new Date();

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

function startGame() {
    resetGame();
    const gameMode = document.getElementById("game-mode").value;

    elements.menu.classList.add("hidden");
    elements.gameContainer.classList.remove("hidden");

    if (gameMode === "matching") startMatchingGame();
    else if (gameMode === "say-the-word") startSayTheWordGame();
    else if (gameMode === "repeat-after-me") startRepeatAfterMeGame();
    else if (gameMode === "fill-in-the-blank") startFillInTheBlankGame();
    else if (gameMode === "build-the-sentence") startBuildTheSentenceGame();
}


function startMatchingGame() {
    const words = document.getElementById("difficulty").value === "easy" ? wordsEasy : wordsHard;
    elements.gameArea.innerHTML = "<p class='game-word'>Match the words!</p>";

    const shuffledWords = shuffle([...words, ...words]);

    shuffledWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.english || word.arabic;
        button.dataset.match = word.english;
        button.addEventListener("click", () => handleMatchClick(button));
        elements.gameArea.appendChild(button);
    });
}

let selectedButtons = [];
function handleMatchClick(button) {
    if (selectedButtons.length === 2) return;

    button.disabled = true;
    selectedButtons.push(button);

    if (selectedButtons.length === 2) {
        const [btn1, btn2] = selectedButtons;
        if (btn1.dataset.match === btn2.dataset.match) {
            correctCount++;
            btn1.classList.add("correct");
            btn2.classList.add("correct");
        } else {
            mistakesCount++;
            btn1.classList.add("wrong");
            btn2.classList.add("wrong");
            setTimeout(() => {
                btn1.classList.remove("wrong");
                btn2.classList.remove("wrong");
                btn1.disabled = false;
                btn2.disabled = false;
            }, 1000);
        }
        selectedButtons = [];
        updateScore();
    }
}

function startSayTheWordGame() {
    const word = getRandomWord();

    elements.gameArea.innerHTML = `<p class="game-word">Say this word: <strong>${word.english}</strong></p>`;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript.toLowerCase();
        if (userSpeech === word.english.toLowerCase()) {
            correctCount++;
            alert("Correct!");
        } else {
            mistakesCount++;
            alert(`Incorrect! The correct word was "${word.english}"`);
        }
        updateScore();
    };
}



function startRepeatAfterMeGame() {
    const word = getRandomWord();

    elements.gameArea.innerHTML = `<p class="game-word">Repeat after me: <strong>${word.english}</strong></p>`;

    const utterance = new SpeechSynthesisUtterance(word.english);
    speechSynthesis.speak(utterance);
}


function startFillInTheBlankGame() {
    const word = getRandomWord();
    const missing = word.english.replace(/./g, (char, index) => (index % 2 === 0 ? char : "_"));

    elements.gameArea.innerHTML = `<p class="game-word">Complete the word: <strong>${missing}</strong></p>`;

    const userInput = prompt(`Complete the word: ${missing}`);
    if (userInput === word.english) {
        correctCount++;
        alert("Correct!");
    } else {
        mistakesCount++;
        alert(`Incorrect! The correct word is: ${word.english}`);
    }
    updateScore();
}


function startBuildTheSentenceGame() {
    const sentence = "I like apples";
    const shuffled = shuffle(sentence.split(" "));

    elements.gameArea.innerHTML = `<p class="game-word">Arrange these words: <strong>${shuffled.join(" ")}</strong></p>`;

    const userAnswer = prompt(`Build the sentence: ${shuffled.join(" ")}`);
    if (userAnswer === sentence) {
        correctCount++;
        alert("Correct!");
    } else {
        mistakesCount++;
        alert(`Incorrect! The correct sentence is: ${sentence}`);
    }
    updateScore();
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function updateDescription() {
    const gameMode = document.getElementById("game-mode").value;
    const descriptions = {
        "matching": "Match English and Arabic words to improve vocabulary.",
        "say-the-word": "Practice pronunciation by saying the word aloud.",
        "repeat-after-me": "Follow and repeat the words spoken by the game.",
        "fill-in-the-blank": "Complete the missing letters in the word.",
        "build-the-sentence": "Arrange words to form a correct sentence."
    };
    document.getElementById("game-description").innerHTML = descriptions[gameMode] || "Select a game mode to see its description.";
}




function getRandomWord() {
    const difficulty = document.getElementById("difficulty").value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;
    return words[Math.floor(Math.random() * words.length)];
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", resetGame);
elements.exitButton.addEventListener("click", () => {
    elements.menu.classList.remove("hidden");
    elements.gameContainer.classList.add("hidden");
    resetGame();
});