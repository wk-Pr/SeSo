const wordsEasy = [...]; // שמור את הרשימה המקורית
const wordsHard = [...]; // שמור את הרשימה המקורית

let selected = [];
let correctCount = 0;
let mistakesCount = 0;
let colorIndex = 0;
const colors = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

const elements = {
    menu: document.getElementById("menu"),
    gameContainer: document.getElementById("game-container"),
    buttonsContainer: document.getElementById("buttons"),
    correctDisplay: document.getElementById("correct"),
    mistakesDisplay: document.getElementById("mistakes"),
    difficultySelect: document.getElementById("difficulty"),
    startButton: document.getElementById("start-game"),
    restartButton: document.getElementById("restart"),
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
        btn1.style.backgroundColor = colors[colorIndex];
        btn2.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    } else {
        mistakesCount++;
        setTimeout(() => selected.forEach(b => (b.disabled = false)), 1000);
    }

    elements.correctDisplay.textContent = correctCount;
    elements.mistakesDisplay.textContent = mistakesCount;

    selected = [];
    if (correctCount === wordsEasy.length) endGame();
}

function endGame() {
    alert(`🎉 Well Done! Correct: ${correctCount}, Mistakes: ${mistakesCount}`);
}

function startGame() {
    resetGame();
    const difficulty = elements.difficultySelect.value;
    const words = difficulty === "easy" ? wordsEasy : wordsHard;

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
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", resetGame);
