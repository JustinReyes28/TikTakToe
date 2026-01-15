/* Game Logic - Newspaper Tik-Tak-Toe */

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const statusText = document.getElementById('game-status');
    const matchNoLabel = document.getElementById('match-number');
    const gameLog = document.getElementById('game-log');
    const winCountSpan = document.getElementById('win-count');
    const gridSizeSelect = document.getElementById('grid-size-select');
    const gameModeSelect = document.getElementById('game-mode-select');
    const botDifficultySelect = document.getElementById('bot-difficulty-select');
    const botDifficultyContainer = document.getElementById('bot-difficulty-container');

    const scoreXLabel = document.getElementById('score-x');
    const scoreOLabel = document.getElementById('score-o');
    const scoreDrawLabel = document.getElementById('score-draw');

    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');

    const newGameBtn = document.getElementById('new-game-btn');
    const resetMatchBtn = document.getElementById('reset-match-btn');
    const printBtn = document.getElementById('print-btn');

    let currentPlayer = 'X';
    let gridSize = 3;
    let gameState = [];
    let gameActive = true;
    let matchCount = 1;
    let scores = { X: 0, O: 0, Draw: 0 };
    let winningConditions = [];
    let gameMode = 'pvp'; // 'pvp' or 'pve'
    let botDifficulty = 'easy';
    let isBotMoving = false;

    const winMap = {
        '3': 'three',
        '4': 'four',
        '5': 'five',
        '6': 'six'
    };

    function generateWinConditions(size) {
        const conditions = [];
        const winLength = size === 5 ? 4 : (size === 6 ? 5 : size); // Match N in a row for NxN grid

        // Rows
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - winLength; j++) {
                const row = [];
                for (let k = 0; k < winLength; k++) {
                    row.push(i * size + j + k);
                }
                conditions.push(row);
            }
        }

        // Columns
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - winLength; j++) {
                const col = [];
                for (let k = 0; k < winLength; k++) {
                    col.push((j + k) * size + i);
                }
                conditions.push(col);
            }
        }

        // Diagonals (top-left to bottom-right)
        for (let i = 0; i <= size - winLength; i++) {
            for (let j = 0; j <= size - winLength; j++) {
                const diag = [];
                for (let k = 0; k < winLength; k++) {
                    diag.push((i + k) * size + j + k);
                }
                conditions.push(diag);
            }
        }

        // Diagonals (top-right to bottom-left)
        for (let i = 0; i <= size - winLength; i++) {
            for (let j = winLength - 1; j < size; j++) {
                const diag = [];
                for (let k = 0; k < winLength; k++) {
                    diag.push((i + k) * size + j - k);
                }
                conditions.push(diag);
            }
        }

        return conditions;
    }

    function createBoard() {
        gridSize = parseInt(gridSizeSelect.value);
        document.documentElement.style.setProperty('--grid-size', gridSize);
        winCountSpan.textContent = winMap[gridSize] || gridSize;
        
        board.innerHTML = '';
        gameState = Array(gridSize * gridSize).fill("");
        winningConditions = generateWinConditions(gridSize);
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }

        // If it's Bot's turn initially (though X usually starts)
        if (gameMode === 'pve' && currentPlayer === 'O' && gameActive) {
            executeBotMove();
        }
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive || isBotMoving) return;

        updateCell(clickedCell, clickedCellIndex);
        checkResult();
    }

    function updateCell(cell, index) {
        gameState[index] = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        const rotation = (Math.random() * 4 - 2).toFixed(2);
        cell.style.setProperty('--rotation', `${rotation}deg`);

        addLogEntry(`${getPlayerName(currentPlayer)} marked square ${index + 1}.`);
    }

    function changePlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `${getPlayerName(currentPlayer).toUpperCase()} TO MOVE`;

        if (gameMode === 'pve' && currentPlayer === 'O' && gameActive) {
            executeBotMove();
        }
    }

    function getPlayerName(symbol) {
        if (gameMode === 'pve' && symbol === 'O') {
            const levels = { 'easy': 'Novice Automaton', 'medium': 'Adept Automaton', 'hard': 'Grandmaster Automaton' };
            return levels[botDifficulty] || 'Automaton';
        }
        try {
            const name = symbol === 'X' ? playerXInput.value : playerOInput.value;
            // Limit length and allowed characters
            const sanitized = name.trim().slice(0, 20);
            const validated = sanitized.replace(/[^a-zA-Z0-9 _-]/g, '');
            return validated || `Player ${symbol}`;
        } catch (error) {
            console.error("Error retrieving player name:", error);
            return `Player ${symbol}`;
        }
    }

    function executeBotMove() {
        isBotMoving = true;
        statusText.innerText = `${getPlayerName('O').toUpperCase()} IS CALCULATING...`;
        
        // Add artificial delay for "thinking" feel
        const delay = Math.random() * 500 + 500;
        
        setTimeout(() => {
            const moveIndex = getBotMove();
            const cell = board.querySelector(`[data-index="${moveIndex}"]`);
            if (cell && gameActive) {
                updateCell(cell, moveIndex);
                isBotMoving = false;
                checkResult();
            } else {
                isBotMoving = false;
            }
        }, delay);
    }

    function getBotMove() {
        if (botDifficulty === 'easy') {
            return getRandomMove();
        } else if (botDifficulty === 'medium') {
            // 60% chance smart, 40% random
            return Math.random() < 0.6 ? findBestMove() : getRandomMove();
        } else {
            return findBestMove();
        }
    }

    function getRandomMove() {
        const availableMoves = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let move = -1;
        
        // Depth limit for larger grids to prevent freezing
        const maxDepth = gridSize > 3 ? 4 : Infinity;

        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "O";
                let score = minimax(gameState, 0, false, -Infinity, Infinity, maxDepth);
                gameState[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move !== -1 ? move : getRandomMove();
    }

    function minimax(board, depth, isMaximizing, alpha, beta, maxDepth) {
        const result = checkWinForMinimax();
        if (result === "O") return 10 - depth;
        if (result === "X") return depth - 10;
        if (result === "draw" || depth >= maxDepth) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false, alpha, beta, maxDepth);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true, alpha, beta, maxDepth);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    }

    function checkWinForMinimax() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, ...rest] = winningConditions[i];
            if (gameState[a] !== "" && rest.every(idx => gameState[idx] === gameState[a])) {
                return gameState[a];
            }
        }
        if (!gameState.includes("")) return "draw";
        return null;
    }

    function checkResult() {
        let roundWon = false;
        let winSequence = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            const firstVal = gameState[condition[0]];
            
            if (firstVal === '') continue;
            
            const isWin = condition.every(index => gameState[index] === firstVal);
            
            if (isWin) {
                roundWon = true;
                winSequence = condition;
                break;
            }
        }

        if (roundWon) {
            handleWin(winSequence);
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            handleDraw();
            return;
        }

        changePlayer();
    }

    function handleWin(sequence) {
        gameActive = false;
        const winnerName = getPlayerName(currentPlayer);
        statusText.innerText = `VICTORY FOR ${winnerName.toUpperCase()}!`;
        statusText.classList.add('winner-headline');

        scores[currentPlayer]++;
        updateScores();
        addLogEntry(`--- MATCH ${matchCount} CONCLUDED ---`);
        addLogEntry(`${winnerName} claims the field.`);

        const cells = board.querySelectorAll('.cell');
        sequence.forEach(index => {
            cells[index].style.backgroundColor = '#f0f0f0';
            cells[index].style.textDecoration = 'line-through';
        });
    }

    function handleDraw() {
        gameActive = false;
        statusText.innerText = "A DRAW! WELL CONTESTED.";
        scores.Draw++;
        updateScores();
        addLogEntry(`--- MATCH ${matchCount} CONCLUDED ---`);
        addLogEntry(`Neither side gains the advantage.`);
    }

    function updateScores() {
        scoreXLabel.innerText = scores.X;
        scoreOLabel.innerText = scores.O;
        scoreDrawLabel.innerText = scores.Draw;
    }

    function addLogEntry(text) {
        try {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const timeSpan = document.createElement('span');
            timeSpan.style.opacity = '0.5';
            timeSpan.style.fontSize = '0.7rem';
            timeSpan.textContent = `[${time}] `;
            entry.appendChild(timeSpan);
            entry.appendChild(document.createTextNode(text));

            if (gameLog.querySelector('.empty-log')) {
                gameLog.textContent = "";
            }
            gameLog.prepend(entry);
        } catch (error) {
            console.error("Error adding log entry:", error);
        }
    }

    function resetGame() {
        currentPlayer = 'X';
        gameActive = true;
        isBotMoving = false;
        matchCount++;

        matchNoLabel.innerText = matchCount;
        createBoard();
        statusText.innerText = `${getPlayerName('X').toUpperCase()} TO MOVE`;
        statusText.classList.remove('winner-headline');

        addLogEntry(`--- MATCH ${matchCount} COMMENCES ---`);
    }

    function resetMatch() {
        try {
            if (confirm("This will reset all scores and match progress. Proceed?")) {
                scores = { X: 0, O: 0, Draw: 0 };
                matchCount = 0;
                updateScores();
                gameLog.textContent = "";
                const emptyMsg = document.createElement('p');
                emptyMsg.className = 'empty-log';
                emptyMsg.textContent = 'Match records cleared.';
                gameLog.appendChild(emptyMsg);
                resetGame();
            }
        } catch (error) {
            console.error("Error resetting match:", error);
        }
    }

    // Event Listeners
    gridSizeSelect.addEventListener('change', () => {
        if (confirm("Changing grid size will reset the current game. Proceed?")) {
            matchCount--; // Don't increment match count for a settings change reset
            resetGame();
        } else {
            // Revert selection if canceled
            gridSizeSelect.value = gridSize;
        }
    });

    gameModeSelect.addEventListener('change', () => {
        gameMode = gameModeSelect.value;
        if (gameMode === 'pve') {
            botDifficultyContainer.style.display = 'block';
            playerOInput.value = getPlayerName('O');
            playerOInput.readOnly = true;
        } else {
            botDifficultyContainer.style.display = 'none';
            playerOInput.readOnly = false;
            playerOInput.value = 'Player O';
        }
        matchCount--;
        resetGame();
    });

    botDifficultySelect.addEventListener('change', () => {
        botDifficulty = botDifficultySelect.value;
        if (gameMode === 'pve') {
            playerOInput.value = getPlayerName('O');
            matchCount--;
            resetGame();
        }
    });

    newGameBtn.addEventListener('click', resetGame);
    resetMatchBtn.addEventListener('click', resetMatch);
    printBtn.addEventListener('click', () => window.print());

    playerXInput.addEventListener('input', () => {
        if (currentPlayer === 'X' && gameActive) statusText.innerText = `${getPlayerName('X').toUpperCase()} TO MOVE`;
    });
    playerOInput.addEventListener('input', () => {
        if (currentPlayer === 'O' && gameActive) statusText.innerText = `${getPlayerName('O').toUpperCase()} TO MOVE`;
    });

    // Initial Board Generation
    createBoard();
});

