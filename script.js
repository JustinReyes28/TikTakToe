document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let gridSize = 3;
    let board = [];
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { x: 0, o: 0 };

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart-btn');
    const scoreXDisplay = document.getElementById('score-x');
    const scoreODisplay = document.getElementById('score-o');
    const gridSizeSelect = document.getElementById('grid-size');

    // Messages
    const winMessage = () => `Player ${currentPlayer} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s Turn`;

    // Initialize game
    initializeGame();

    function initializeGame() {
        gridSize = parseInt(gridSizeSelect.value);
        createBoard();
        restartGame();
    }

    function createBoard() {
        // Clear existing board
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        // Reset board array
        board = Array(gridSize * gridSize).fill('');

        // Create cells
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-cell-index', i);
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }

    // Handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

        // Check if cell is already played or game is inactive
        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        // Update board and UI
        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        if (checkWin()) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.textContent = currentPlayerTurn();
        }
    }

    // Check for win
    function checkWin() {
        const size = gridSize;
        const winLength = (size === 3) ? 3 : 4;
        const cells = document.querySelectorAll('.cell');

        // Helper to check a sequence of indices
        function checkSequence(indices) {
            const first = board[indices[0]];
            if (first === '' || first === undefined) return false;

            const isWin = indices.every(index => board[index] === first);
            if (isWin) {
                // Highlight winning cells
                indices.forEach(index => {
                    cells[index].classList.add('win');
                });
                return true;
            }
            return false;
        }

        // Iterate through all possible starting positions
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                // 1. Horizontal
                if (c + winLength <= size) {
                    let indices = [];
                    for (let k = 0; k < winLength; k++) {
                        indices.push(r * size + (c + k));
                    }
                    if (checkSequence(indices)) return true;
                }

                // 2. Vertical
                if (r + winLength <= size) {
                    let indices = [];
                    for (let k = 0; k < winLength; k++) {
                        indices.push((r + k) * size + c);
                    }
                    if (checkSequence(indices)) return true;
                }

                // 3. Diagonal (Top-Left to Bottom-Right)
                if (r + winLength <= size && c + winLength <= size) {
                    let indices = [];
                    for (let k = 0; k < winLength; k++) {
                        indices.push((r + k) * size + (c + k));
                    }
                    if (checkSequence(indices)) return true;
                }

                // 4. Diagonal (Top-Right to Bottom-Left)
                if (r + winLength <= size && c - winLength + 1 >= 0) {
                    let indices = [];
                    for (let k = 0; k < winLength; k++) {
                        indices.push((r + k) * size + (c - k));
                    }
                    if (checkSequence(indices)) return true;
                }
            }
        }

        return false;
    }

    // Check for draw
    function isDraw() {
        return board.every(cell => cell !== '');
    }

    // End the game
    function endGame(draw) {
        gameActive = false;

        if (draw) {
            statusDisplay.textContent = drawMessage();
        } else {
            statusDisplay.textContent = winMessage();
            updateScores();
        }
    }

    // Update scores
    function updateScores() {
        if (currentPlayer === 'X') {
            scores.x++;
            scoreXDisplay.textContent = scores.x;
        } else {
            scores.o++;
            scoreODisplay.textContent = scores.o;
        }
    }

    // Restart the game logic
    function restartGame() {
        board = Array(gridSize * gridSize).fill('');
        gameActive = true;
        currentPlayer = 'X';

        statusDisplay.textContent = currentPlayerTurn();

        // Clear all cells and remove visual classes
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
    }

    // Full Reset (re-create board if needed, but mainly for logic)
    function handleRestart() {
        // If grid size changed, we need to recreate the board
        const currentSizeFromSelect = parseInt(gridSizeSelect.value);
        if (currentSizeFromSelect !== gridSize) {
            gridSize = currentSizeFromSelect;
            createBoard();
        }
        restartGame();
    }

    // Listen for grid size change to restart immediately or wait for manual restart?
    // Let's restart immediately when size changes for better UX.
    gridSizeSelect.addEventListener('change', () => {
        gridSize = parseInt(gridSizeSelect.value);
        createBoard();
        // Reset scores or keep them? Usually new game type = new scores, but keeping them is fine too.
        // Let's reset game state but keep scores for now, unless user reloads.
        restartGame();
    });

    restartButton.addEventListener('click', handleRestart);
});