document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game-board");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("start-button");
    const highscoreDisplay = document.getElementById("highscore");

    // Define Tetromino shapes
    const tetrominos = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[1, 1, 1], [0, 1, 0]], // T
        [[1, 1, 1], [1, 0, 0]], // L
        [[1, 1, 1], [0, 0, 1]], // J
        [[1, 1, 0], [0, 1, 1]], // S
        [[0, 1, 1], [1, 1, 0]]  // Z
    ];

    // Define Tetromino colors
    const tetrominoColors = [
        "#00FFFF", // Cyan
        "#FFFF00", // Yellow
        "#800080", // Purple
        "#FFA500", // Orange
        "#0000FF", // Blue
        "#00FF00", // Green
        "#FF0000"  // Red
    ];

    // Initialize game variables
    let board = Array.from({ length: 20 }, () => Array(10).fill(0));
    let currentTetromino;
    let currentTetrominoColor;
    let currentX, currentY;
    let score = 0;
    let gameOver = false;
    let gameInterval;
    let level = 1;
    let speed = 1000; // Initial speed in milliseconds

    // Define game functions
    function drawBoard() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 10; col++) {
                if (board[row][col]) {
                    ctx.fillStyle = tetrominoColors[board[row][col] - 1];
                    ctx.fillRect(col * 20, row * 20, 20, 20);
                }
            }
        }
    }

    function drawTetromino() {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    ctx.fillStyle = currentTetrominoColor;
                    ctx.fillRect((currentX + col) * 20, (currentY + row) * 20, 20, 20);
                }
            }
        }
    }

    function moveTetromino(dirX, dirY) {
        if (!checkCollision(currentTetromino, currentX + dirX, currentY + dirY)) {
            currentX += dirX;
            currentY += dirY;
            drawBoard();
            drawTetromino();
        }
    }

    function rotateTetromino() {
        const newTetromino = rotateMatrix(currentTetromino);
        if (!checkCollision(newTetromino, currentX, currentY)) {
            currentTetromino = newTetromino;
            drawBoard();
            drawTetromino();
        }
    }

    function checkCollision(tetromino, x, y) {
        for (let row = 0; row < tetromino.length; row++) {
            for (let col = 0; col < tetromino[row].length; col++) {
                if (tetromino[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;

                    if (boardX < 0 || boardX >= 10 || boardY >= 20 || boardY < 0 || board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function clearRows() {
        let rowsCleared = 0;
        for (let row = 19; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(10).fill(0));
                rowsCleared++;
            }
        }
        if (rowsCleared > 0) {
            // Update the score and level here
            score += rowsCleared * 100 * level;
            if (score % 1000 === 0) {
                level++;
                increaseSpeed();
            }
            highscoreDisplay.innerText = `Score: ${score} | Level: ${level}`;
        }
    }

    function gameOverCheck() {
        if (board[0].some(cell => cell !== 0)) {
            clearInterval(gameInterval);
            gameOver = true;
            alert("Game Over! Your Score: " + score);
        }
    }

    function increaseSpeed() {
        // Decrease speed by 10% for each level increase
        speed = speed * 0.9;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }

    function gameLoop() {
        moveTetromino(0, 1);
        if (gameOver) clearInterval(gameInterval);
    }

    function updateHighscore() {
        // Implement highscore update logic here
    }

    function startGame() {
        board = Array.from({ length: 20 }, () => Array(10).fill(0));
        score = 0;
        gameOver = false;
        currentX = 0;
        currentY = 0;
        currentTetromino = getRandomTetromino();
        currentTetrominoColor = tetrominoColors[Math.floor(Math.random() * tetrominoColors.length)];
        highscoreDisplay.innerText = `Score: ${score} | Level: ${level}`;
        drawBoard();
        drawTetromino();

        gameInterval = setInterval(gameLoop, speed);
    }

    // Helper function to rotate a matrix (Tetromino)
    function rotateMatrix(matrix) {
        const rotatedMatrix = [];
        const rows = matrix.length;
        const cols = matrix[0].length;

        for (let col = 0; col < cols; col++) {
            const newRow = [];
            for (let row = rows - 1; row >= 0; row--) {
                newRow.push(matrix[row][col]);
            }
            rotatedMatrix.push(newRow);
        }

        return rotatedMatrix;
    }

    function getRandomTetromino() {
        const randomIdx = Math.floor(Math.random() * tetrominos.length);
        return tetrominos[randomIdx];
    }

    // Add event listeners
    startButton.addEventListener("click", startGame);
    document.addEventListener("keydown", (e) => {
        if (!gameOver) {
            if (e.key === "ArrowLeft") {
                moveTetromino(-1, 0);
            } else if (e.key === "ArrowRight") {
                moveTetromino(1, 0);
            } else if (e.key === "ArrowDown") {
                moveTetromino(0, 1);
            } else if (e.key === "ArrowUp") {
                rotateTetromino();
            }
        }
    });

    // Call startGame to initialize the game
    startGame();
});
