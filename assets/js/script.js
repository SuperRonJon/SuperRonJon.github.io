let size = 100;


function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function createEmptyMatrix(cols, rows) {
    let grid = Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = Array(cols);
    }
    return grid;
}

function createRandomMatrix(cols, rows) {
    let grid = Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let value = randomInt(0, 1);
            if (value == 1) {
                grid[i][j] = "alive";
            } else {
                grid[i][j] = "dead";
            }
        }
    }
    return grid;
}

function drawMatrix(matrix) {
    let body = document.body;
    for (let x = 0; x < size; x++) {
        let row = document.createElement("div");
        row.className = "flex-container";
        for (let y = 0; y < size; y++) {
            let cell = document.createElement("div");
            cell.className = "flex-item";
            cell.classList.add(matrix[x][y]);
            row.appendChild(cell);
        }
        body.appendChild(row);
    }
}

function updateMatrix(matrix) {
    let resultMatrix = createEmptyMatrix(size, size);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let left =  modulo((y - 1), size);
            let right = modulo((y + 1), size);
            let up =  modulo((x - 1), size);
            let down = modulo((x + 1), size);

            let numNeighbors = 0;
            if (matrix[up][left] === "alive") {
                numNeighbors++;
            }
            if (matrix[up][y] === "alive") {
                numNeighbors++;
            }
            if (matrix[up][right] === "alive") {
                numNeighbors++;
            }
            if (matrix[x][left] === "alive") {
                numNeighbors++;
            }
            if (matrix[x][right] === "alive") {
                numNeighbors++;
            }
            if (matrix[down][left] === "alive") {
                numNeighbors++;
            }
            if (matrix[down][y] === "alive") {
                numNeighbors++;
            }
            if (matrix[down][right] === "alive") {
                numNeighbors++;
            }

            if (matrix[x][y] === "alive" && (numNeighbors === 2 || numNeighbors === 3)) {
                resultMatrix[x][y] = "alive";
            } else if(matrix[x][y] === "dead" && numNeighbors ===3) {
                resultMatrix[x][y] = "alive";
            } else {
                resultMatrix[x][y] = "dead";
            }
        }
    }
    return resultMatrix;
}

function removeDrawing() {
    document.body.innerHTML = "";
}

function mainLoop() {
    grid = updateMatrix(grid);
    removeDrawing();
    drawMatrix(grid);
}


let grid = createRandomMatrix(size, size);
drawMatrix(grid);

setInterval(mainLoop, 100, grid)