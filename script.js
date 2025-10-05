const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const levelButtons = document.querySelectorAll(".level button");

const cellSize = 30;
const rows = Math.floor(canvas.height / cellSize);
const cols =  Math.floor(canvas.width / cellSize);

const headImg = new Image();
const bodyImg = new Image();
const tailImg = new Image();
const coinImg = new Image();

headImg.src = "images/snakeHead.png";
bodyImg.src = "images/snakeBody.png";     
tailImg.src = "images/SnakeTail.png";     
coinImg.src = "images/coin.png";

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") 
    ? parseInt(localStorage.getItem("snakeHighScore")) 
    : 0;

let coin = null;
let snake = [{x: 5, y: 5}];
let game;
let direction = "RIGHT";
let selectedSpeed = 200;

document.getElementById("highScoreValue").textContent = highScore;

function coinSpawn () {
    do {
        coin = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        }
    } while (snake.some(segment => segment.x === coin.x && segment.y === coin.y))        
}

function drawCoin() {
    if (coin) {
        let size = cellSize * 1.5;
        ctx.drawImage(
            coinImg,
            coin.x * cellSize + (cellSize - size) / 2,
            coin.y * cellSize + (cellSize - size) / 2,
            size, size
        );
    }
}

function getDirection(from, to) {
    if (from.x < to.x) return "RIGHT";
    if (from.x > to.x) return "LEFT";
    if (from.y < to.y) return "DOWN";
    if (from.y > to.y) return "UP";
}

function drawHead(x, y, dir) {
    ctx.save();
    ctx.translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    if (dir === "UP") ctx.rotate(-Math.PI / 2);
    if (dir === "DOWN") ctx.rotate(Math.PI / 2);
    if (dir === "LEFT") ctx.rotate(Math.PI);
    ctx.drawImage(headImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    ctx.restore();
}

function drawTail(x, y, dir) {
    ctx.save();
    ctx.translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
    if (dir === "UP") ctx.rotate(-Math.PI / 2);
    if (dir === "DOWN") ctx.rotate(Math.PI / 2);
    if (dir === "LEFT") ctx.rotate(Math.PI);
    ctx.drawImage(tailImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
    ctx.restore();
}

function drawSnake () {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawCoin();

    drawHead(snake[0].x, snake[0].y, direction);

    for (let i = 1; i < snake.length - 1; i++) {
        let curr = snake[i];
        ctx.drawImage(bodyImg, curr.x * cellSize, curr.y * cellSize, cellSize, cellSize);
    }

    if (snake.length > 1) {
        let tail = snake[snake.length - 1];
        let beforeTail = snake[snake.length - 2];
        let tailDir = getDirection(beforeTail, tail);
        drawTail(tail.x, tail.y, tailDir);
    }
}

function moveSnake() {
    let head = {...snake[0]};

    if(direction === "UP") head.y -= 1;
    if(direction === "DOWN") head.y += 1;
    if(direction === "LEFT") head.x -= 1;
    if(direction === "RIGHT") head.x += 1;

    if (
        head.x < 0 || head.x >= cols ||
        head.y < 0 || head.y >= rows ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
        clearInterval(game);
        game = null;
        document.getElementById("gameOver").style.display = "block";
        pauseBtn.style.display = "none";
        return;
    }

    snake.unshift(head);

    if(head.x === coin.x && head.y === coin.y) {
        score++;
        scoreDisplay.querySelector("#scoreValue").textContent = score;

         if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            document.getElementById("highScoreValue").textContent = highScore;
        }

        coinSpawn();
    } else {
        snake.pop();
    }

    drawSnake();
}

function resetGame() {
    score = 0;
    scoreDisplay.querySelector("#scoreValue").textContent = score;
    snake = [{x: 5, y: 5}];
    direction = "RIGHT";
    document.getElementById("gameOver").style.display = "none";
    pauseBtn.style.display = "inline-block";
    pauseBtn.textContent = "Pause";
    coinSpawn();
    drawSnake();
    clearInterval(game);
    game = setInterval(moveSnake, selectedSpeed);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (e.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (e.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (e.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});

levelButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        let level = btn.textContent.toLowerCase();
        if(level === "medium") selectedSpeed = 150;
        else if(level === "hard") selectedSpeed = 100;
        else selectedSpeed = 200;

        levelButtons.forEach(b => b.style.backgroundColor = "");
        btn.style.backgroundColor = "lightgreen";
    });
});

startBtn.addEventListener("click", () => {
    if (!game) {
        if (document.getElementById("gameOver").style.display === "block") {
            resetGame();
        } else{
            coinSpawn();
            drawSnake();
            game = setInterval(moveSnake, selectedSpeed);
        }
    }
});

restartBtn.addEventListener("click", resetGame);

pauseBtn.addEventListener("click", ()=> {
    if (game) {
        clearInterval(game);
        game = null;
        pauseBtn.textContent = "Resume";
    } else {
        game = setInterval(moveSnake, selectedSpeed);
        pauseBtn.textContent = "Pause";
    }
});
