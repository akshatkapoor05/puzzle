var size = 4; 
let emptyTile = { row: size - 1, col: size - 1 };
let tiles = [];


function shuffleTilesWithEmptyTile() {
  const emptyIndex = emptyTile.row * size + emptyTile.col;

  for (let i = tiles.length - 2; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  [tiles[emptyIndex], tiles[tiles.length - 1]] = [tiles[tiles.length - 1], tiles[emptyIndex]];

  emptyTile.row = size - 1;
  emptyTile.col = size - 1;
}

// Helper function to check if the game is solved
function isSolved() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) {
      return false;
    }
  }
  return true;
}

// Helper function to update the board
function updateBoard() {
  const board = document.getElementById('puzzle-board');
  board.innerHTML = '';

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const tileIndex = i * size + j;
      const tileValue = tiles[tileIndex];
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (tileValue !== size * size) {
        tile.textContent = tileValue;
        tile.addEventListener('click', () => moveTile(i, j));
      }
      tile.style.width = (300 / size) + 'px';
      tile.style.height = (300 / size) + 'px';
      board.appendChild(tile);

      if (tileValue === size * size) {
        tile.classList.add('empty');
      }
    }
  }
}

// Helper function to check if the tile can be moved
function canMoveTile(row, col) {
  return (
    (Math.abs(emptyTile.row - row) === 1 && emptyTile.col === col) ||
    (Math.abs(emptyTile.col - col) === 1 && emptyTile.row === row)
  );
}

// Helper function to move the tile
function moveTile(row, col) {
  if (canMoveTile(row, col)) {
    const tileIndex = row * size + col;
    const emptyIndex = emptyTile.row * size + emptyTile.col;

    [tiles[tileIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[tileIndex]];
    emptyTile.row = row;
    emptyTile.col = col;

    updateBoard();

    if (isSolved()) {
      alert('Congratulations! You solved the puzzle!');
    }
  }
}

// Helper function to start a new game
function newGame() {
  size = parseInt(document.getElementById("boardSize").value);
  emptyTile = { row: size - 1, col: size - 1 };
  tiles = [...Array(size * size).keys()].map(x => x + 1);
  tiles[size * size - 1] = size * size;
  shuffleTilesWithEmptyTile();
  updateBoard();
  moveCount = 0;
  startTime = Date.now();
  updateMoveCount();
  loadBestTimes();
  startTimer();
  updateTimer();
}


function handleKeyboardInput(event) {
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const key = event.key;
  
    if (arrowKeys.includes(key)) {
      event.preventDefault(); // Prevent page scrolling with arrow keys
      let newRow = emptyTile.row;
      let newCol = emptyTile.col;
  
      switch (key) {
        case "ArrowUp":
          newRow = emptyTile.row - 1;
          break;
        case "ArrowDown":
          newRow = emptyTile.row + 1;
          break;
        case "ArrowLeft":
          newCol = emptyTile.col - 1;
          break;
        case "ArrowRight":
          newCol = emptyTile.col + 1;
          break;
      }
  
      moveTile(newRow, newCol);
    }
  }

  // Helper function to handle tile click and move
function handleClickAndMove(event) {
    const tile = event.target;
    const row = Math.floor(Array.from(tile.parentNode.children).indexOf(tile) / size);
    const col = Array.from(tile.parentNode.children).indexOf(tile) % size;
    
    moveTile(row, col);
  }


let startTime = 0;
let moveCount = 0;
const bestTimesKey = 'bestTimes';

// Helper function to start the timer
function startTimer() {
  startTime = Date.now();
  setInterval(updateTimer, 1000);
}

// Helper function to update the timer display
function updateTimer() {
  const timerElement = document.getElementById('timer');
  const currentTime = Date.now() - startTime;
  const seconds = Math.floor(currentTime / 1000);
  timerElement.textContent = `Time: ${seconds}s`;
}

// Helper function to update the move count display
function updateMoveCount() {
  const moveCountElement = document.getElementById('move-count');
  moveCountElement.textContent = `Moves: ${moveCount}`;
}

// Helper function to load and display the best times from local storage
function loadBestTimes() {
  const bestTimesElement = document.getElementById('best-times');
  const bestTimesData = localStorage.getItem(bestTimesKey);
  if (bestTimesData) {
    const bestTimes = JSON.parse(bestTimesData);
    let leaderboardHtml = '<h3>Best Times</h3><ol>';
    bestTimes.forEach(time => {
      leaderboardHtml += `<li>${time}s</li>`;
    });
    leaderboardHtml += '</ol>';
    bestTimesElement.innerHTML = leaderboardHtml;
  }
}

// Helper function to save the best time to local storage
function saveBestTime(time) {
  const bestTimesData = localStorage.getItem(bestTimesKey);
  if (bestTimesData) {
    const bestTimes = JSON.parse(bestTimesData);
    bestTimes.push(time);
    bestTimes.sort((a, b) => a - b);
    if (bestTimes.length > 5) {
      bestTimes.pop();
    }
    localStorage.setItem(bestTimesKey, JSON.stringify(bestTimes));
  } else {
    const bestTimes = [time];
    localStorage.setItem(bestTimesKey, JSON.stringify(bestTimes));
  }
}

// Helper function to reset the game and update best times
function resetGame() {
  moveCount = 0;
  startTime = 0;
  updateTimer();
  updateMoveCount();
  loadBestTimes();
  newGame();
}

// Add event listeners for reset button and call startTimer on page load
window.addEventListener('load', () => {
  updateBoard();
  document.addEventListener('keydown', handleKeyboardInput);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);

  const tiles = document.getElementsByClassName('tile');
  Array.from(tiles).forEach(tile => tile.addEventListener('click', handleClickAndMove));

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetGame);

  updateTimer();
  startTimer();

});

// Helper function to move the tile
function moveTile(row, col) {
    if (canMoveTile(row, col)) {
      const tileIndex = row * size + col;
      const emptyIndex = emptyTile.row * size + emptyTile.col;
  
      [tiles[tileIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[tileIndex]];
      emptyTile.row = row;
      emptyTile.col = col;
  
      moveCount++; // Increment the move count
      updateBoard();
      updateMoveCount(); // Update the move count display
  
      if (isSolved()) {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        alert(`Congratulations! You solved the puzzle in ${currentTime} seconds with ${moveCount} moves.`);
        saveBestTime(currentTime); // Save the best time to local storage
        resetGame(); // Reset the game after completion
      }
    }
  }

  // Helper function to update the timer display
function updateTimer() {
    const timerElement = document.getElementById('timer');
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = `Time: ${currentTime}s`;
  }
  
  // Helper function to reset the game and update best times
  function resetGame() {
    moveCount = 0;
    startTime = Date.now(); // Reset the start time
    updateTimer();
    updateMoveCount();
    loadBestTimes();
    newGame();
  }

