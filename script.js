const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;
let coin = null;

let snake = [{x: 5, y: 5}];
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

function getDirection(from, to) {
    if (from.x < to.x) return "RIGHT";
    if (from.x > to.x) return "LEFT";
    if (from.y < to.y) return "DOWN";
    if (from.y > to.y) return "UP";
}

function drawHead(x, y, dir) {
    ctx.save();
    ctx.translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
    if (dir === "UP") ctx.rotate(-Math.PI / 2)
    if (dir === "DOWN") ctx.rotate(Math.PI / 2)
    if (dir === "LEFT") ctx.rotate(Math.PI)
    ctx.drawImage(headImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize)
    ctx.restore();
}

function drawTail(x, y, dir) {
    ctx.save();
    ctx.translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
    if (dir === "UP") ctx.rotate(-Math.PI / 2)
    if (dir === "DOWN") ctx.rotate(Math.PI / 2)
    if (dir === "LEFT") ctx.rotate(Math.PI)
    ctx.drawImage(tailImg, -cellSize / 2, -cellSize / 2, cellSize, cellSize)
    ctx.restore();
}

function drawSnake () {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    if(coin) {
        let size = cellSize * 1.5;
        ctx.drawImage(
            coinImg, 
            coin.x * cellSize + (cellSize - size) / 2,
            coin.y * cellSize + (cellSize - size) / 2,
            size, size
        )
    }

    drawHead(snake[0].x, snake[0].y, direction);

    for (let i = 1; i < snake.length - 1; i++) {
        let curr = snake[i];
        ctx.drawImage(bodyImg, curr.x * cellSize, curr.y * cellSize, cellSize, cellSize)
    }

    if (snake.length > 1) {
        let tail = snake[snake.length - 1]
        let beforeTail = snake[snake.length - 2]
        let tailDir = getDirection(beforeTail, tail)
        drawTail(tail.x, tail.y, tailDir);
    }
}

    // snake.forEach(segment => {
    //     ctx.drawImage(snakeImg, segment.x * cellSize,
    //          segment.y * cellSize, cellSize, cellSize)
    // });
    


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
        document.getElementById("gameOver").style.display = "block";
        return;
    }

    snake.unshift(head);

    if(head.x === coin.x && head.y === coin.y) {
        score++;
        scoreDisplay.textContent = "score:" + score;
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
    if (game) {
        clearInterval(game)
        game = null;
        pauseBtn.textContent = "Resume";
    } else {
        game = setInterval(moveSnake, 200)
        pauseBtn.textContent = "Pause";
    }
})

coinSpawn();
drawSnake();
