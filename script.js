const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
let coin = null;

let snake = [{x: 5, y: 5}];
const cellSize = 30;
const rows = canvas.height / cellSize;
const cols =  canvas.width / cellSize;

const snakeImg = new Image()
snakeImg.src = "images/snake.png"

const coinImg = new Image()
coinImg.src = "images/coin.png"

let game;
let direction = "RIGHT";

function coinSpawn () {
    do {
        coin = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        }

    } while (snake.some(segment => segment.x === coin.x && segment.y === coin.y))
        
}


function drawSnake () {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    if(coin) ctx.drawImage(coinImg, coin.x * cellSize,
         coin.y * cellSize, cellSize, cellSize)

    snake.forEach(segment => {
        ctx.drawImage(snakeImg, segment.x * cellSize,
             segment.y * cellSize, cellSize, cellSize)
    });
    
}

function moveSnake() {
    let head = {...snake[0]};

    if(direction === "UP") head.y -= 1;
    if(direction === "DOWN") head.y += 1;
    if(direction === "LEFT") head.x -= 1;
    if(direction === "RIGHT") head.x += 1;

    if
    (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
       snake.some(seg => seg.x === head.x && seg.y === head.y))
        {
        clearInterval(game);
        alert("Game Over! Score: " + score);
        return;
    }

    snake.unshift(head);

    if(head.x === coin.x && head.y === coin.y) {
        score++;
        scoreDisplay.textContent = score;
        coinSpawn();
    } else {
        snake.pop();
    }

    drawSnake();
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
})


const startBtn = document.getElementById("startBtn")
const restartBtn = document.getElementById("restartBtn")
const pauseBtn = document.getElementById("pauseBtn")

startBtn.addEventListener("click", () => {
    if (!game) {
        game = setInterval(moveSnake, 200)
    }
})

restartBtn.addEventListener("click", () => {
    location.reload()
})

pauseBtn.addEventListener("click", ()=> {
    clearInterval(game);
    game = null;
})

coinSpawn();
drawSnake();
