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

// ערבוב המילים
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// יצירת הכפתורים
function createButtons(words) {
    const shuffledWords = shuffle([...words, ...words]);
    shuffledWords.forEach((word, index) => {
        const button = document.createElement("button");
        button.textContent = index % 2 === 0 ? word.english : word.arabic;
        button.style.fontWeight = "bold";
        button.style.fontSize = `${fontSize}px`;
        button.dataset.match = word.english;
        button.dataset.correct = "false"; // מעקב אחרי התאמה
        button.addEventListener("click", () => handleButtonClick(button));
        buttonsContainer.appendChild(button);
    });
}

// טיפול בבחירת כפתור
function handleButtonClick(button) {
    if (selected.length === 2) return;

    button.disabled = true;
    selected.push(button);

    if (selected.length === 2) {
        checkMatch();
    }
}

// בדיקת התאמה
function checkMatch() {
    const [btn1, btn2] = selected;

    if (btn1.dataset.match === btn2.dataset.match) {
        btn1.style.backgroundColor = colors[colorIndex];
        btn2.style.backgroundColor = colors[colorIndex];
        btn1.dataset.correct = "true";
        btn2.dataset.correct = "true";
        correctCount++;
        colorIndex = (colorIndex + 1) % colors.length;
    } else {
        btn1.style.backgroundColor = "red";
        btn2.style.backgroundColor = "red";
        mistakesCount++;
    }

    correctDisplay.textContent = correctCount;
    mistakesDisplay.textContent = mistakesCount;

    setTimeout(() => {
        if (btn1.dataset.correct !== "true") btn1.style.backgroundColor = "";
        if (btn2.dataset.correct !== "true") btn2.style.backgroundColor = "";
        selected = [];

        if (correctCount === wordsEasy.length) {
            alert("🎉 Congratulations! You finished the game! 🎉");
        }
    }, 1000);
}

// התחלת המשחק
function startGame() {
    resetGame();
    const difficulty = difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    createButtons(words);
}

// איפוס המשחק
function resetGame() {
    buttonsContainer.innerHTML = "";
    correctCount = 0;
    mistakesCount = 0;
    correctDisplay.textContent = correctCount;
    mistakesDisplay.textContent = mistakesCount;
    colorIndex = 0;
}

// שינוי גודל טקסט
function changeFontSize(increase) {
    fontSize += increase ? 2 : -2;
    const buttons = buttonsContainer.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.fontSize = `${fontSize}px`;
    });
}

// כפתורי שינוי גודל
increaseFontButton.textContent = "+";
decreaseFontButton.textContent = "-";
increaseFontButton.style.margin = "10px";
decreaseFontButton.style.margin = "10px";
increaseFontButton.addEventListener("click", () => changeFontSize(true));
decreaseFontButton.addEventListener("click", () => changeFontSize(false));

gameContainer.appendChild(increaseFontButton);
gameContainer.appendChild(decreaseFontButton);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
