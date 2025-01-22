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
let fontSize = 16;
const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const buttonsContainer = document.getElementById("buttons");
const correctDisplay = document.getElementById("correct");
const mistakesDisplay = document.getElementById("mistakes");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart");
const increaseFontButton = document.createElement("button");
const decreaseFontButton = document.createElement("button");

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createButtons(words) {
    const englishWords = words.map(w => ({ text: w.english, match: w.english }));
    const arabicWords = words.map(w => ({ text: w.arabic, match: w.english }));
    const allWords = shuffle([...englishWords, ...arabicWords]);

    allWords.forEach(word => {
        const button = document.createElement("button");
        button.textContent = word.text;
        button.style.fontWeight = "bold";
        button.style.fontSize = `${fontSize}px`;
        button.dataset.match = word.match;
        button.dataset.correct = "false";
        button.addEventListener("click", () => handleButtonClick(button));
        buttonsContainer.appendChild(button);
    });
}

function handleButtonClick(button) {
    if (selected.length === 2) return;

    button.disabled = true;
    selected.push(button);

    if (selected.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [btn1, btn2] = selected;

    if (btn1.dataset.match === btn2.dataset.match) {
        const color = colors[colorIndex];
        btn1.style.backgroundColor = color;
        btn2.style.backgroundColor = color;
        btn1.dataset.correct = "true";
        btn2.dataset.correct = "true";
        correctCount++;
        colorIndex = (colorIndex + 1) % colors.length;
    } else {
        btn1.style.backgroundColor = "red";
        btn2.style.backgroundColor = "red";
        setTimeout(() => {
            btn1.style.backgroundColor = "";
            btn2.style.backgroundColor = "";
            btn1.disabled = false;
            btn2.disabled = false;
        }, 1000);
        mistakesCount++;
    }

    correctDisplay.textContent = correctCount;
    mistakesDisplay.textContent = mistakesCount;

    selected = [];

    if (correctCount === wordsEasy.length) {
        endGame();
    }
}

function endGame() {
    const message = `🎉 Congratulations! 🎉\n\nCorrect: ${correctCount}\nMistakes: ${mistakesCount}`;
    const resultWindow = document.createElement("div");
    resultWindow.style.position = "absolute";
    resultWindow.style.top = "20%";
    resultWindow.style.left = "50%";
    resultWindow.style.transform = "translate(-50%, -20%)";
    resultWindow.style.backgroundColor = "#fff";
    resultWindow.style.border = "2px solid #000";
    resultWindow.style.padding = "20px";
    resultWindow.style.textAlign = "center";
    resultWindow.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    resultWindow.innerHTML = `
        <h2>SESO</h2>
        <p>${message}</p>
        <button onclick="takeScreenshot()">📷 Save Screenshot</button>
    `;
    document.body.appendChild(resultWindow);
}

function takeScreenshot() {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement("a");
        link.download = "game_result.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}

function startGame() {
    resetGame();
    const difficulty = difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    createButtons(words);
}

function resetGame() {
    buttonsContainer.innerHTML = "";
    correctCount = 0;
    mistakesCount = 0;
    correctDisplay.textContent = correctCount;
    mistakesDisplay.textContent = mistakesCount;
    colorIndex = 0;
}

// כפתורי שינוי גודל טקסט
increaseFontButton.textContent = "+";
decreaseFontButton.textContent = "-";
increaseFontButton.style.margin = "10px";
decreaseFontButton.style.margin = "10px";
increaseFontButton.addEventListener("click", () => changeFontSize(true));
decreaseFontButton.addEventListener("click", () => changeFontSize(false));

gameContainer.appendChild(increaseFontButton);
gameContainer.appendChild(decreaseFontButton);

function changeFontSize(increase) {
    fontSize += increase ? 2 : -2;
    const buttons = buttonsContainer.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.fontSize = `${fontSize}px`;
    });
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
