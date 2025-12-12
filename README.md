# TikTakToe

A dynamic and interactive implementation of the classic Tic-Tac-Toe game, built with vanilla HTML, CSS, and JavaScript. This project features customizable grid sizes, real-time scoring, and a responsive design for an engaging user experience.

### Live Demo
Experience TikTakToe live: [https://justinreyes28.github.io/TikTakToe/](https://justinreyes28.github.io/TikTakToe/)

## Features

- **Variable Grid Sizes**: Choose from 3x3, 4x4, 5x5, or 6x6 grids to adjust the game's difficulty and win conditions.
- **Dynamic Win Detection**: Automatically detects wins based on the grid size (3 in a row for 3x3, 4 in a row for larger grids) across rows, columns, and diagonals.
- **Scoring System**: Tracks and displays scores for both players (X and O) across multiple games.
- **Game Status Updates**: Real-time display of whose turn it is, win messages, or draw notifications.
- **Restart Functionality**: Easily restart the current game or change grid size mid-session.
- **Responsive Design**: Optimized for various screen sizes with a clean, modern UI.
- **No Dependencies**: Runs entirely in the browser with no external libraries required.

## How to Play

1. **Objective**: Be the first to get a line of marks (X or O) in a row, column, or diagonal.
   - For 3x3 grids: 3 in a row.
   - For larger grids (4x6, 5x5, 6x6): 4 in a row.
2. **Turns**: Players alternate turns, starting with Player X.
3. **Moves**: Click on an empty cell to place your mark.
4. **Winning**: The game highlights the winning cells and updates the score.
5. **Draw**: If the grid fills without a winner, it's a draw.
6. **Restart**: Use the "Restart Game" button to reset the board or change grid size via the dropdown.

## Technologies Used

- **HTML5**: Structure and semantic markup for the game interface.
- **CSS3**: Styling for responsive layout, animations, and visual feedback (e.g., highlighting winning cells).
- **JavaScript (ES6+)**: Game logic, event handling, state management, and DOM manipulation.

## Project Structure

```
TikTakToe/
├── index.html          # Main HTML file with game layout and structure
├── styles.css          # CSS styles for UI, responsiveness, and animations
├── script.js           # JavaScript logic for game mechanics, win detection, and interactions
├── README.md           # Project documentation (this file)
└── LICENSE             # Unlicense (public domain)
```

- **index.html**: Contains the game board, score display, controls, and footer. Links to CSS and JS files.
- **styles.css**: Defines styles for the container, game board, cells, buttons, and responsive breakpoints.
- **script.js**: Implements game state, event listeners, win checking algorithms, and UI updates.

## Installation and Setup

No installation required! This is a client-side web application.

1. **Clone or Download**: Download the project files to your local machine.
2. **Open in Browser**: Double-click `index.html` or open it in any modern web browser (Chrome, Firefox, Safari, etc.).
3. **Play**: Start playing immediately. No server or build process needed.

For development:
- Edit the files directly in a code editor (e.g., VS Code).
- Refresh the browser to see changes.

## Usage

- **Starting the Game**: Open `index.html` in a browser. The game begins with a 3x3 grid and Player X's turn.
- **Changing Grid Size**: Select a new size from the dropdown. The board updates automatically, and the game restarts.
- **Scoring**: Scores persist across restarts but reset on page reload.
- **Accessibility**: The game uses semantic HTML and keyboard-friendly elements for better usability.

## Contributing

Contributions are welcome! This project is open-source under the Unlicense.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make changes and test thoroughly.
4. Commit: `git commit -m 'Add your feature'`.
5. Push: `git push origin feature/your-feature`.
6. Open a pull request.

Ideas for contributions:
- Add AI opponent mode.
- Implement themes or animations.
- Add sound effects or multiplayer support.

## License

This project is released into the public domain under the [Unlicense](LICENSE). You are free to use, modify, and distribute it without any restrictions.

## Author

Created by Justin Reyes. Feel free to reach out for questions or feedback.

## Acknowledgments

- Inspired by the classic Tic-Tac-Toe game.
- Built as a demonstration of vanilla web technologies.
