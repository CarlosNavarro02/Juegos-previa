let players = [];
let scores = {};
let cards = [];
let currentCardIndex = 0;
let currentPlayerIndex = 0;
let selectedCategory = 'medium';

function goHome() {
  showScreen('home-screen');
}

function goToGame(game) {
  if (game === 'yo-nunca') {
    players = [];
    renderPlayerList();
    showScreen('setup-screen');
    addPlayer();
    addPlayer();
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addPlayer() {
  const num = players.length + 1;
  players.push({ name: `Jugador ${num}` });
  renderPlayerList();
}

function removePlayer(index) {
  if (players.length <= 2) return;
  players.splice(index, 1);
  renderPlayerList();
}

function renderPlayerList() {
  const list = document.getElementById('player-list');
  list.innerHTML = players.map((p, i) => `
    <div class="player-input-row">
      <input
        type="text"
        class="player-input"
        value="${p.name}"
        placeholder="Nombre del jugador"
        oninput="players[${i}].name = this.value.trim() || 'Jugador ${i + 1}'"
      />
      ${players.length > 2 ? `<button class="remove-player" onclick="removePlayer(${i})">✕</button>` : ''}
    </div>
  `).join('');
}

function selectCategory(btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedCategory = btn.dataset.cat;
}

function startGame() {
  const names = players.map(p => p.name || 'Jugador');
  players = names.map(n => ({ name: n }));
  scores = {};
  players.forEach(p => { scores[p.name] = 0; });

  cards = getCards(selectedCategory);
  currentCardIndex = 0;
  currentPlayerIndex = 0;

  renderCard();
  renderScoreboard();
  showScreen('game-screen');
}

function renderCard() {
  const card = cards[currentCardIndex];
  const player = players[currentPlayerIndex];

  document.getElementById('card-text').textContent = card;
  document.getElementById('current-player').textContent = player.name;
  document.getElementById('card-counter').textContent = `Carta ${currentCardIndex + 1}/${cards.length}`;
  document.getElementById('turn-indicator').innerHTML =
    `Turno de <span id="current-player">${player.name}</span>`;

  const cardEl = document.getElementById('main-card');
  cardEl.classList.remove('flip');
  void cardEl.offsetWidth;
  cardEl.classList.add('flip');
}

function nextCard() {
  currentCardIndex++;
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  if (currentCardIndex >= cards.length) {
    endGame();
    return;
  }
  renderCard();
}

function registerDrink(playerName) {
  scores[playerName] = (scores[playerName] || 0) + 1;
  renderScoreboard();
}

function endGame() {
  const sorted = [...players].sort((a, b) => scores[b.name] - scores[a.name]);
  const winner = sorted[0];
  document.getElementById('winner-name').textContent = `🍺 ${winner.name} (${scores[winner.name]} tragos)`;

  const finalScores = document.getElementById('final-scores');
  finalScores.innerHTML = sorted.map((p, i) =>
    `<div class="final-score-row">
      <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
      <span>${p.name}</span>
      <span>${scores[p.name]} tragos</span>
    </div>`
  ).join('');

  showScreen('end-screen');
}

function restartGame() {
  startGame();
}

function renderScoreboard() {
  const sb = document.getElementById('scoreboard');
  const sorted = [...players].sort((a, b) => scores[b.name] - scores[a.name]);
  sb.innerHTML = `
    <p class="drink-label">¿Quién tomó? (tocá su nombre)</p>
    <div class="drink-chips">
      ${players.map(p =>
    `<button class="drink-chip" data-player="${p.name}" onclick="registerDrink('${p.name}')">${p.name} 🍺</button>`
  ).join('')}
    </div>
    <div class="scores-list">
      ${sorted.map(p =>
    `<div class="score-row">
          <span class="score-name">${p.name}</span>
          <span class="score-count">${scores[p.name] || 0} tragos</span>
        </div>`
  ).join('')}
    </div>
  `;
}
