document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { x: 0, o: 0 };
    
    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart-btn');
    const scoreXDisplay = document.getElementById('score-x');
    const scoreODisplay = document.getElementById('score-o');
    
    // Winning combinations
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Messages
    const winMessage = () => `Player ${currentPlayer} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `Player ${currentPlayer}'s Turn`;
    
    // Initialize game status
    statusDisplay.textContent = currentPlayerTurn();
    
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
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                // Highlight winning cells
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                return true;
            }
            return false;
        });
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
    
    // Restart the game
    function restartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        
        statusDisplay.textContent = currentPlayerTurn();
        
        // Clear all cells and remove win styling
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
    }
    
    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
});