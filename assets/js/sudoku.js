class Box {
    constructor(value = -1) {
        this.value = value;
        this.isDefault = true;
        if(value === -1) {
            this.isDefault = false;
        }
    }

    clear() {
        if(!this.isDefault) {
            this.value = -1;
        }
    }

    isEmpty() {
        return this.value === -1;
    }

    getCellValue() {
        return this.value === -1 ? " " : this.value;
    }

    setCellValue(val) {
        this.value = val;
    }
}

class Board {
    constructor(boardString = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
        this.BOARD_SIZE = 9;
        this.grid = [];
        this.isSolved = false;
        let index = 0;
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            this.grid[i] = [];
            for(let j = 0; j < this.BOARD_SIZE; j++) {
                if(!this.isEmptyCharacter(boardString[index])) {
                    this.grid[i][j] = new Box(parseInt(boardString[index]));
                }
                else {
                    this.grid[i][j] = new Box();
                }
                index++;
            }
        }
    }

    print(borders) {
        let row = "";
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            if(borders && i !== 0 && i % 3 === 0) {
                row += "------+-------+------\n";
            }
            //let row = "";
            for(let j = 0; j < this.BOARD_SIZE; j++) {
                if(borders && j !== 0 && j % 3 === 0) {
                    row += "| ";
                }
                if(!this.grid[i][j].isEmpty()) {
                    row += this.grid[i][j].value + " ";
                }
                else {
                    row += "x ";
                }
            }  
            row += "\n"
        }
        console.log(row);
    }

    solve() {
        // Check the board isn't initially invalid before attempting to solve.
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            for(let j = 0; j < this.BOARD_SIZE; j++) {
                if(!this.grid[i][j].isEmpty()) {
                    if(!this.isPossibility(this.grid[i][j].value, i, j, true)) {
                        this.isSolved = false;
                        return;
                    }
                    this.grid[i][j].isDefault = true;
                }
            }
        }
        this.isSolved = this.iSolve(0, 0);
    }

    iSolve(row, col) {
        if(row === this.BOARD_SIZE - 1 && col === this.BOARD_SIZE) {
            return true;
        }
        if(col === this.BOARD_SIZE) {
            row++;
            col = 0;
        }

        if(!this.grid[row][col].isEmpty()) {
            return this.iSolve(row, col+1);
        }

        for(let i = 1; i <= this.BOARD_SIZE; i++) {
            if(this.isPossibility(i, row, col)) {
                this.grid[row][col].value = i;
                if(this.iSolve(row, col+1)) {
                    return true;
                }
                this.grid[row][col].clear();
            }
        }
        return false;
    }

    // Checks if it is possible to insert number into board.grid[row][col]
    // If skip is true the cell that is being analyzed is not counted.
    // Skip is necessary to check if number is allowed to be where it already is
    isPossibility(number, row, col, skip=false) {
        return (!this.rowContains(number, row, col, skip) && !this.columnContains(number, row, col, skip) && !this.squareContains(number, row, col, skip));
    }

    // Checks if the board has any empty spaces
    isFull() {
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            for(let j = 0; j < this.BOARD_SIZE; j++) {
                if(this.grid[i][j].value === -1) {
                    return false;
                }
            }
        }
        return true;
    }

    rowContains(number, row, col, skip=false) {
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            if(skip && col === i) {
                continue;
            }
            if(this.grid[row][i].value === number && !(skip && row === i)) {
                return true;
            }
        }
        return false;
    }

    columnContains(number, row, column, skip=false) {
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            if(skip && row === i) {
                continue;
            }
            if(this.grid[i][column].value === number) {
                return true;
            }
        }
        return false;
    }

    squareContains(number, row, col, skip=false) {
        let startRow = row - (row % 3);
        let startCol = col - (col % 3);

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(skip && row === i + startRow && col === j + startCol) {
                    continue;
                }
                if(this.grid[i + startRow][j + startCol].value === number) {
                    return true;
                }
            }
        }
        return false;
    }

    isEmptyCharacter(char) {
        return (char === 'x' || char === 'X' || char === '0'|| char === 'o'|| char === 'O'|| char === '.');
    }

    // Exports active board to a loadable string with empty cells represented by emptyChar
    exportToString(emptyChar='x') {
        let resultString = "";
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            for(let j = 0; j < this.BOARD_SIZE; j++) {
                if(this.grid[i][j].value !== -1) {
                    resultString += this.grid[i][j].value;
                }
                else {
                    resultString += emptyChar;
                }
            }
        }
        return resultString;
    }
}

// Draws the values of board.grid onto cells, list of td elements representing the board to draw on.
// colorDefault and colorSolved will color the solved and initial values accordingly
function setBoard(board, cells, colorDefault=false, colorSolved=false) {
    let index = 0;
    for(let i = 0; i < board.BOARD_SIZE; i++) {
        for(let j = 0; j < board.BOARD_SIZE; j++) {
            cells[index].textContent = board.grid[i][j].getCellValue();
            if(colorSolved && !board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = board.isSolved ? solvedColor: failColor;                
            }
            if(colorDefault && board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = defaultColor;
            }
            if(!colorSolved && !board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = "";
            }
            if(!colorDefault && board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = "";
            }
            index++;
        }
    }
}

// clears the displayed values in cells
function clearBoard(cells, boardSize = 9) {
    let index = 0;
    for(let i = 0; i < boardSize; i++) {
        for(let j = 0; j < boardSize; j++) {
            cells[index].textContent = "";
            cells[index].style.backgroundColor = "";
            index++;
        }
    }
}

function isValidBoard(boardString) {
    if(boardString.length !== 81) {
        return false;
    }
    return true;
}

function indexToPair(index) {
    const BOARD_SIZE = 9;
    return [Math.floor(index/BOARD_SIZE), index % BOARD_SIZE];
}

const solveButton = document.querySelector("#solveButton");
const loadButton = document.querySelector("#loadButton");
const clearButton = document.querySelector("#clearButton");
const exportButton = document.querySelector("#exportButton");
const boardInput = document.querySelector("#boardInput");
const colorCheckbox = document.querySelector("#colorCheckbox");
const resultString = document.querySelector("#resultString");
const unsolvedCells = document.getElementById("unsolved").getElementsByTagName("td");
const solvedCells = document.getElementById("solved").getElementsByTagName("td");
const allCells = document.getElementsByTagName("td");
const solvedColor = "lightgreen";
const defaultColor = "lightgrey";
const failColor = "lightcoral";

let isLoaded = false;
let activeBoard = new Board();

let activeCell = null;
let activeCellIndex = null;

for(let i = 0; i < unsolvedCells.length; i++) {
    unsolvedCells[i].addEventListener('click', () => {
        if(activeCell === unsolvedCells[i]) {
            activeCell.classList.remove('selected');
            activeCell = null;
            activeCellIndex = null;
        }
        else {
            if(activeCell !== null) {
                activeCell.classList.remove('selected');
            }
            activeCell = unsolvedCells[i];
            activeCellIndex = i;
            if(!activeCell.classList.contains('selected')) {
                activeCell.classList.add('selected');
            }
        }
    });
}

document.addEventListener('keypress', (e) => {
    const keyPressed = parseInt(e.key)
    if(activeCell !== null && !isNaN(keyPressed) && (0 <= keyPressed && keyPressed <= 9)) {
        const [row, col] = indexToPair(activeCellIndex);
        if(keyPressed === 0 && !activeBoard?.grid[row][col].isDefault) {
            activeCell.textContent = "";
            activeBoard?.grid[row][col].setCellValue(-1);
        }
        else if(keyPressed !== 0 && !activeBoard?.grid[row][col].isDefault && !activeBoard?.isSolved) {
            activeCell.textContent = keyPressed;
            activeBoard?.grid[row][col].setCellValue(keyPressed);
        }
    }
});

window.addEventListener('keydown', (e) => {
    if(activeCell !== null) {
        switch(e.key) {
            case "ArrowRight":
                if(activeCellIndex !== unsolvedCells.length - 1) {
                    activeCell.classList.remove('selected');
                    activeCellIndex++;
                    activeCell = unsolvedCells[activeCellIndex];
                    activeCell.classList.add('selected');
                }
                
                break;
            case "ArrowLeft":
                if(activeCellIndex !== 0) {
                    activeCell.classList.remove('selected');
                    activeCellIndex--;
                    activeCell = unsolvedCells[activeCellIndex];
                    activeCell.classList.add('selected');
                }
                break;
            case "ArrowUp":
                if(activeCellIndex > 8) {
                    activeCell.classList.remove('selected');
                    activeCellIndex -= 9;
                    activeCell = unsolvedCells[activeCellIndex];
                    activeCell.classList.add('selected');
                }
                break;
            case "ArrowDown":
                if(activeCellIndex < 72) {
                    activeCell.classList.remove('selected');
                    activeCellIndex += 9;
                    activeCell = unsolvedCells[activeCellIndex];
                    activeCell.classList.add('selected');
                }
                break;
            case "Backspace":
                const [row, col] = indexToPair(activeCellIndex);
                if(!activeBoard?.grid[row][col].isDefault) {
                    activeCell.textContent = "";
                    activeBoard?.grid[row][col].setCellValue(-1); 
                }
        }
    }
    
});

loadButton.addEventListener('click', () => {
    boardString = boardInput.value;
    if(isValidBoard(boardString)) {
        activeBoard = new Board(boardString);
        isLoaded = true;
        setBoard(activeBoard, unsolvedCells);
        clearBoard(solvedCells);
    }
});

solveButton.addEventListener('click', () => {
    if(activeBoard) {
        if(!activeBoard.isFull()) {
            activeBoard.solve();
        }
        setBoard(activeBoard, solvedCells, colorCheckbox.checked, colorCheckbox.checked);
    }    
});

clearButton.addEventListener('click', () => {
    activeBoard = new Board();
    isLoaded = false;
    clearBoard(solvedCells);
    clearBoard(unsolvedCells);
    resultString.textContent = "";
});

exportButton.addEventListener('click', () => {
    resultString.textContent = "Current Board String: " + activeBoard.exportToString();
});
