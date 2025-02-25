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
}

class Board {
    constructor(boardString) {
        this.BOARD_SIZE = 9;
        this.grid = [];
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
        this.iSolve(0, 0);
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

    isPossibility(number, row, col) {
        return (!this.rowContains(number, row) && !this.columnContains(number, col) && !this.squareContains(number, row, col));
    }

    rowContains(number, row) {
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            if(this.grid[row][i].value === number) {
                return true;
            }
        }
        return false;
    }

    columnContains(number, column) {
        for(let i = 0; i < this.BOARD_SIZE; i++) {
            if(this.grid[i][column].value === number) {
                return true;
            }
        }
        return false;
    }

    squareContains(number, row, col) {
        let startRow = row - (row % 3);
        let startCol = col - (col % 3);

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
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
}

function setBoard(board, cells, colorDefault=false, colorSolved=false) {
    let index = 0;
    for(let i = 0; i < board.BOARD_SIZE; i++) {
        for(let j = 0; j < board.BOARD_SIZE; j++) {
            cells[index].textContent = board.grid[i][j].getCellValue();
            if(colorSolved && !board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = solvedColor;
            }
            if(colorDefault && board.grid[i][j].isDefault) {
                cells[index].style.backgroundColor = defaultColor;
            }
            index++;
        }
    }
}

function clearBoard(board, cells) {
    let index = 0;
    for(let i = 0; i < board.BOARD_SIZE; i++) {
        for(let j = 0; j < board.BOARD_SIZE; j++) {
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

const solveButton = document.querySelector("#solveButton");
const loadButton = document.querySelector("#loadButton");
const boardInput = document.querySelector("#boardInput");
const colorCheckbox = document.querySelector("#colorCheckbox");
const unsolvedCells = document.getElementById("unsolved").getElementsByTagName("td");
const solvedCells = document.getElementById("solved").getElementsByTagName("td");
const allCells = document.getElementsByTagName("td");
const solvedColor = "lightgreen";
const defaultColor = "lightgrey";

let isLoaded = false;
let activeBoard = null;

loadButton.addEventListener('click', () => {
    boardString = boardInput.value;
    if(isValidBoard(boardString)) {
        activeBoard = new Board(boardString);
        isLoaded = true;
        setBoard(activeBoard, unsolvedCells);
        clearBoard(activeBoard, solvedCells);
    }
});

solveButton.addEventListener('click', () => {
    if(!isLoaded) {
        console.log("Board is not loaded to solve.");
        return;
    }
    activeBoard.solve();
    setBoard(activeBoard, solvedCells, colorCheckbox.checked, colorCheckbox.checked);
});
