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