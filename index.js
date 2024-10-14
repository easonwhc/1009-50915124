const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const themeSelect = document.getElementById('theme-select');
const gridSizeSelect = document.getElementById('grid-size');
const flipTimeSelect = document.getElementById('flip-time');
const hideMatchedCheckbox = document.getElementById('hide-matched');
const timerDisplay = document.getElementById('timer');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let isPlaying = false;
let countdownTimer;

const themes = {
    animals: ['images/animals/1.jpg', 'images/animals/2.jpg', 'images/animals/3.jpg', 'images/animals/4.jpg',
        'images/animals/5.jpg', 'images/animals/6.jpg', 'images/animals/7.jpg', 'images/animals/8.jpg',
        'images/animals/9.jpg', 'images/animals/10.jpg', 'images/animals/11.jpg', 'images/animals/12.jpg',
        'images/animals/13.jpg', 'images/animals/14.jpg', 'images/animals/15.jpg', 'images/animals/16.jpg',
        'images/animals/17.jpg', 'images/animals/18.jpg'],
    fruits: ['images/fruits/1.jpg', 'images/fruits/2.jpg', 'images/fruits/3.jpg', 'images/fruits/4.jpg',
        'images/fruits/5.jpg', 'images/fruits/6.jpg', 'images/fruits/7.jpg', 'images/fruits/8.jpg',
        'images/fruits/9.jpg', 'images/fruits/10.jpg', 'images/fruits/11.jpg', 'images/fruits/12.jpg',
        'images/fruits/13.jpg', 'images/fruits/14.jpg', 'images/fruits/15.jpg', 'images/fruits/16.jpg',
        'images/fruits/17.jpg', 'images/fruits/18.jpg']
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(imagePath) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-front"><img src="${imagePath}" alt="card"></div>
        <div class="card-back"></div>
    `;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function startGame() {
    isPlaying = true;
    matchedPairs = 0;
    gameContainer.innerHTML = '';
    cards = [];
    flippedCards = [];

    const gridSize = parseInt(gridSizeSelect.value);
    const theme = themes[themeSelect.value];
    totalPairs = Math.floor(gridSize * gridSize / 2);

    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const gameCards = shuffleArray(theme.slice(0, totalPairs).concat(theme.slice(0, totalPairs)));

    gameCards.forEach(imagePath => {
        const card = createCard(imagePath);
        cards.push(card);
        gameContainer.appendChild(card);
    });

    setTimeout(() => {
        cards.forEach(card => card.classList.add('flipped'));
        startCountdown(parseInt(flipTimeSelect.value));
    }, 500);
}

function flipCard(card) {
    if (!isPlaying || flippedCards.length >= 2 || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.querySelector('.card-front img').src === card2.querySelector('.card-front img').src;

    if (isMatch) {
        matchedPairs++;
        if (hideMatchedCheckbox.checked) {
            card1.classList.add('hidden');
            card2.classList.add('hidden');
        }
        playSound('match');
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        playSound('nomatch');
    }

    flippedCards = [];

    if (matchedPairs === totalPairs) {
        setTimeout(() => {
            alert('遊戲結束!');
            isPlaying = false;
        }, 500);
    }
}

function startCountdown(seconds) {
    clearInterval(countdownTimer);
    let remainingTime = seconds;
    timerDisplay.textContent = `倒數: ${remainingTime}秒`;

    countdownTimer = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = `倒數: ${remainingTime}秒`;

        if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            cards.forEach(card => card.classList.remove('flipped'));
        }
    }, 1000);
}

function playSound(type) {
    const audio = new Audio(type === 'match' ? 'sounds/match.mp3' : 'sounds/nomatch.mp3');
    audio.play();
}

startButton.addEventListener('click', startGame);