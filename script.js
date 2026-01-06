/* Game Logic - Newspaper Tik-Tak-Toe */

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const statusText = document.getElementById('game-status');
    const matchNoLabel = document.getElementById('match-number');
    const gameLog = document.getElementById('game-log');
    const winCountSpan = document.getElementById('win-count');
    const gridSizeSelect = document.getElementById('grid-size-select');

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

    const winMap = {
        '3': 'three',
        '4': 'four',
        '5': 'five',
        '6': 'six'
    };

    function generateWinConditions(size) {
        const conditions = [];
        const winLength = size; // Match N in a row for NxN grid

        // Rows
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
            }
            conditions.push(row);
        }

        // Columns
        for (let i = 0; i < size; i++) {
            const col = [];
            for (let j = 0; j < size; j++) {
                col.push(j * size + i);
            }
            conditions.push(col);
        }

        // Diagonals
        const diag1 = [];
        const diag2 = [];
        for (let i = 0; i < size; i++) {
            diag1.push(i * size + i);
            diag2.push(i * size + (size - 1 - i));
        }
        conditions.push(diag1);
        conditions.push(diag2);

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
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) return;

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
    }

    function getPlayerName(symbol) {
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
