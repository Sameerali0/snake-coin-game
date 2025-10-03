const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

let score = 0;
let snake = [42];
let coin = null;

function createBoard() {
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        board.appendChild(cell)
    }
}

createBoard();

const cells = document.querySelectorAll(".cell")

function drawSnake () {
    cells.forEach(cell => cell.classList.remove("snake"))
    snake.forEach(index => cells[index].classList.add("snake"))
}

function coinSpawn () {
    do {
        coin = Math.floor(Math.random() * 400)
    } while (snake.includes(coin));
        cells[coin].classList.add("coin")
}

drawSnake();
coinSpawn();

let direction = "RIGHT"

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

function moveSnake () {
    let head = snake [0]

    if ( direction  === "UP") head -= 20
    else if (direction === "DOWN") head += 20
    else if (direction === "LEFT") head -= 1
    else if (direction === "RIGHT") head +=1

    if ( 
        head < 0 || head >= 400 ||
        (direction === "LEFT" && head % 20 === 19) ||
        (direction === "RIGHT" && head % 20 === 0) ||
        snake.includes(head)
    ) {
        alert ("Game Over! Final Score:" + score)
        location.reload()
        return
    }
    
    snake.unshift(head)

    if (head === coin) {
        score++;
        scoreDisplay.textContent = score

        cells[coin].classList.remove("coin")
        coinSpawn();
    } else {
        snake.pop()
    }

    drawSnake();

}

setInterval(moveSnake, 200)

