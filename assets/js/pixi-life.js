const app = new PIXI.Application();

const WINDOW_WIDTH = 1900;
const WINDOW_HEIGHT = 900;
const GRID_SIZE = 10;
const GRID_WIDTH = WINDOW_WIDTH / GRID_SIZE;
const GRID_HEIGHT = WINDOW_HEIGHT / GRID_SIZE;
const ALIVE = true;
const DEAD = false;

await app.init({ width: WINDOW_WIDTH, height: WINDOW_HEIGHT});

document.body.appendChild(app.canvas);

function getColor(value) {
    return value ? "white" : "black";
    
}

function drawGrid(cells, graphics) {
    graphics.clear();
    for(let row = 0; row < GRID_HEIGHT; row++) {
        for(let col = 0; col < GRID_WIDTH; col++) {
            graphics
                .rect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE)
                .fill(getColor(cells[row][col]));
        }
    }
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function initCells(randomize = true) {
    let grid = Array(GRID_HEIGHT);
    for(let i = 0; i < GRID_HEIGHT; i++) {
        grid[i] = Array(GRID_WIDTH);
    }

    for(let i = 0; i < GRID_HEIGHT; i++) {
        for(let j = 0; j < GRID_WIDTH; j++) {
            let value = randomInt(0, 3);
            if(value == 1 && randomize) {
                grid[i][j] = ALIVE;
            }
            else {
                grid[i][j] = DEAD;
            }
        }
    }
    return grid;
}

function updateGrid(cells, resultCells) {
    for(let row = 0; row < GRID_HEIGHT; row++) {
        for(let col = 0; col < GRID_WIDTH; col++) {
            const LEFT = modulo((col - 1), GRID_WIDTH);
            const RIGHT = modulo((col + 1), GRID_WIDTH);
            const UP = modulo((row - 1), GRID_HEIGHT);
            const DOWN = modulo((row + 1), GRID_HEIGHT);

            let numNeighbors = 0;
            if(cells[UP][LEFT] === ALIVE) {
                numNeighbors++;
            }
            if(cells[UP][col] === ALIVE) {
                numNeighbors++;
            }
            if(cells[UP][RIGHT] === ALIVE) {
                numNeighbors++;
            }
            if(cells[row][LEFT] === ALIVE) {
                numNeighbors++;
            }
            if(cells[row][RIGHT] === ALIVE) {
                numNeighbors++;
            }
            if(cells[DOWN][LEFT] === ALIVE) {
                numNeighbors++;
            }
            if(cells[DOWN][col] === ALIVE) {
                numNeighbors++;
            }
            if(cells[DOWN][RIGHT] === ALIVE) {
                numNeighbors++;
            }

            if(cells[row][col] === ALIVE && (numNeighbors === 2 || numNeighbors === 3)) {
                resultCells[row][col] = ALIVE;
            }
            else if(cells[row][col] === DEAD && numNeighbors === 3) {
                resultCells[row][col] = ALIVE;
            }
            else {
                resultCells[row][col] = DEAD;
            }
        }
    }
}

let cells = initCells();
let nextCells = initCells(false);
let savedCells = structuredClone(cells);
const graphics = new PIXI.Graphics();
let playing = true;
let playOne = false;
let saveOnStart = false;

let leftMouseButtonHeld = false;
let rightMouseButtonHeld = false;

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener("keyup", (event) => {
    switch(event.code) {
        case "Space":
            playing = !playing;
            if(playing && saveOnStart) {
                savedCells = structuredClone(cells);
                saveOnStart = false;
            } 
            break;
        case "Enter":
            cells = initCells();
            break;
        case "Backspace":
            cells = initCells(false);
            saveOnStart = true;
            break;
    }    
});

document.addEventListener("keydown", (event) => {
    switch(event.code) {
        case "ArrowRight":
            playOne = true;
            if(saveOnStart) {
                savedCells = structuredClone(cells);
                saveOnStart = false;
            }
            break;
        case "ArrowLeft":
            cells = structuredClone(savedCells);
            if(!playing) {
                saveOnStart = true;
            }
            break;
    }
});

document.addEventListener("mousedown", (event) => {
    let colIndex = parseInt((event.offsetX - modulo(event.offsetX, GRID_SIZE)) / GRID_SIZE);
    let rowIndex = parseInt((event.offsetY - modulo(event.offsetY, GRID_SIZE)) / GRID_SIZE);

    if(event.button === 0 && !playing) {
        if(event.ctrlKey) {
            cells[rowIndex][colIndex] = DEAD;
            rightMouseButtonHeld = true;
        }
        else {
            cells[rowIndex][colIndex] = ALIVE;
            leftMouseButtonHeld = true;    
        }
    }
});
document.addEventListener("mouseup", (event) => {
    if(event.button === 0) {
        leftMouseButtonHeld = false;
        rightMouseButtonHeld = false;
    }
});
document.addEventListener("mousemove", (event) => {
    let colIndex = parseInt((event.offsetX - modulo(event.offsetX, GRID_SIZE)) / GRID_SIZE);
    let rowIndex = parseInt((event.offsetY - modulo(event.offsetY, GRID_SIZE)) / GRID_SIZE);

    if(rowIndex < GRID_HEIGHT && colIndex < GRID_WIDTH) {
        if(!playing && leftMouseButtonHeld) {
            cells[rowIndex][colIndex] = ALIVE;
        }    
        else if(!playing && rightMouseButtonHeld) {
            cells[rowIndex][colIndex] = DEAD;
        }
    }
});

let elapsed = 0.0;
app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    
    drawGrid(cells, graphics);
    app.stage.addChild(graphics);
    if(playing || playOne) {
        playOne = false;
        updateGrid(cells, nextCells);
        [cells, nextCells] = [nextCells, cells];
    }
});
