/* Game Logic - Newspaper Tik-Tak-Toe */

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const matchNoLabel = document.getElementById('match-number');
    const gameLog = document.getElementById('game-log');

    const scoreXLabel = document.getElementById('score-x');
    const scoreOLabel = document.getElementById('score-o');
    const scoreDrawLabel = document.getElementById('score-draw');

    const playerXInput = document.getElementById('player-x-name');
    const playerOInput = document.getElementById('player-o-name');

    const newGameBtn = document.getElementById('new-game-btn');
    const resetMatchBtn = document.getElementById('reset-match-btn');
    const printBtn = document.getElementById('print-btn');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let matchCount = 1;
    let scores = { X: 0, O: 0, Draw: 0 };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

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

        // Add random rotation to mark for hand-drawn look
        const rotation = (Math.random() * 4 - 2).toFixed(2);
        cell.style.setProperty('--rotation', `${rotation}deg`);

        addLogEntry(`${getPlayerName(currentPlayer)} marked square ${index + 1}.`);
    }

    function changePlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `${getPlayerName(currentPlayer).toUpperCase()} TO MOVE`;
    }

    function sanitizeText(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.textContent;
    }

    function validatePlayerName(name, symbol) {
        // Limit length and allowed characters
        const sanitized = name.trim().slice(0, 20);
        // Allow alpha-numeric, space, hyphen, underscore
        const validated = sanitized.replace(/[^a-zA-Z0-9 _-]/g, '');
        return validated || `Player ${symbol}`;
    }

    function getPlayerName(symbol) {
        try {
            const name = symbol === 'X' ? playerXInput.value : playerOInput.value;
            return validatePlayerName(name, symbol);
        } catch (error) {
            console.error("Error retrieving player name:", error);
            return `Player ${symbol}`;
        }
    }

    function checkResult() {
        let roundWon = false;
        let winSequence = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                winSequence = [a, b, c];
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

        // Draw winning line (visual only)
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
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        matchCount++;

        matchNoLabel.innerText = matchCount;
        statusText.innerText = `${getPlayerName('X').toUpperCase()} TO MOVE`;
        statusText.classList.remove('winner-headline');

        cells.forEach(cell => {
            cell.className = 'cell';
            cell.style.backgroundColor = '';
            cell.style.textDecoration = '';
        });

        addLogEntry(`--- MATCH ${matchCount} COMMENCES ---`);
    }

    function resetMatch() {
        try {
            if (confirm("This will reset all scores and match progress. Proceed?")) {
                scores = { X: 0, O: 0, Draw: 0 };
                matchCount = 0; // Will be incremented to 1 in resetGame
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
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    newGameBtn.addEventListener('click', resetGame);
    resetMatchBtn.addEventListener('click', resetMatch);
    printBtn.addEventListener('click', () => window.print());

    // Sync status if names change
    playerXInput.addEventListener('input', () => {
        if (currentPlayer === 'X' && gameActive) statusText.innerText = `${getPlayerName('X').toUpperCase()} TO MOVE`;
    });
    playerOInput.addEventListener('input', () => {
        if (currentPlayer === 'O' && gameActive) statusText.innerText = `${getPlayerName('O').toUpperCase()} TO MOVE`;
    });
});
