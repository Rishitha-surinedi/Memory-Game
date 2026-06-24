const grid = document.getElementById('grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

const emojis = ['🐶','🐱','🦊','🐼','🐨','🐸','🐵','🦁'];
let cardArray = [...emojis, ...emojis]; // duplicate for pairs
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;

// Shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// Initialize Game
function initGame() {
  grid.innerHTML = '';
  cardArray = shuffle(cardArray);
  moves = 0;
  matches = 0;
  seconds = 0;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = seconds;
  stopTimer();

  cardArray.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${emoji}</div>
        <div class="card-back"></div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

// Flip Card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    startTimer();
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  movesDisplay.textContent = moves;

  checkMatch();
}

// Check Match
function checkMatch() {
  const isMatch = firstCard.querySelector('.card-front').textContent ===
                  secondCard.querySelector('.card-front').textContent;

  if (isMatch) {
    matches++;
    triggerConfetti();
    resetCards(true);
    if (matches === emojis.length) {
      stopTimer();
      setTimeout(() => alert(`You won in ${moves} moves and ${seconds} seconds! 🎉`), 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetCards(false);
    }, 1000);
  }
}

// Reset cards
function resetCards(match) {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Restart button
restartBtn.addEventListener('click', initGame);

// Initialize first game
initGame();


// --- Confetti ---
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
const confettiParticles = [];

function triggerConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 100,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = 0; i < confettiParticles.length; i++) {
    const p = confettiParticles[i];
    ctx.beginPath();
    ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.r);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.r;
    ctx.stroke();
    p.y += Math.cos(0.01 + p.d) + 1 + p.r / 2;
    p.x += Math.sin(0.01);
    if (p.y > confettiCanvas.height) confettiParticles.splice(i, 1);
  }
  if (confettiParticles.length > 0) requestAnimationFrame(animateConfetti);
}
