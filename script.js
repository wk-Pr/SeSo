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

const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const buttonsContainer = document.getElementById("buttons");
const correctDisplay = document.getElementById("correct");
const mistakesDisplay = document.getElementById("mistakes");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-game");

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createButtons(words) {
    const shuffledWords = shuffle([...words, ...words]);
    shuffledWords.forEach((word, index) => {
        const button = document.createElement("button");
        button.textContent = index % 2 === 0 ? word.english : word.arabic;
        button.dataset.match = word.english;
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
        btn1.classList.add("correct");
        btn2.classList.add("correct");
        correctCount++;
    } else {
        btn1.classList.add("wrong");
        btn2.classList.add("wrong");
        mistakesCount++;
    }

    correctDisplay.textContent = correctCount;
    mistakesDisplay.textContent = mistakesCount;

    setTimeout(() => {
        btn1.disabled = false;
        btn2.disabled = false;
        btn1.classList.remove("wrong");
        btn2.classList.remove("wrong");
        selected = [];

        if (correctCount === wordsEasy.length) {
            alert("Congratulations! 🎉 You finished the game!");
        }
    }, 1000);
}

function startGame() {
    const difficulty = difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    createButtons(words);
}

startButton.addEventListener("click", startGame);
