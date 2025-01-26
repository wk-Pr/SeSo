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
let colorIndex = 0;
const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];
let currentDifficulty = "easy";

const elements = {
    menu: document.getElementById("menu"),
    gameContainer: document.getElementById("game-container"),
    buttonsContainer: document.getElementById("buttons"),
    correctDisplay: document.getElementById("correct"),
    mistakesDisplay: document.getElementById("mistakes"),
    difficultySelect: document.getElementById("difficulty"),
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
    exitButton: document.getElementById("exit"),
};

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createButtons(words) {
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
        }, 2000);
    }

    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;

    selected = [];

    if (correctCount === (currentDifficulty === "easy" ? wordsEasy.length : wordsHard.length)) {
        endGame();
    }
}

function endGame() {
    alert(`🎉 Well Done! Correct: ${correctCount}, Mistakes: ${mistakesCount}`);
}

function startGame() {
    currentDifficulty = elements.difficultySelect.value;
    resetGame();
    const words = currentDifficulty === "easy" ? wordsEasy : wordsHard;

    elements.menu.classList.add("hidden");
    elements.gameContainer.classList.remove("hidden");

    createButtons(words);
}

function resetGame() {
    elements.buttonsContainer.innerHTML = "";
    correctCount = 0;
    mistakesCount = 0;
    colorIndex = 0;
    elements.correctDisplay.textContent = "0";
    elements.mistakesDisplay.textContent = "0";

    const words = currentDifficulty === "easy" ? wordsEasy : wordsHard;
    createButtons(words);
}

function exitToMenu() {
    elements.gameContainer.classList.add("hidden");
    elements.menu.classList.remove("hidden");
    resetGame();
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", resetGame);
elements.exitButton.addEventListener("click", exitToMenu);