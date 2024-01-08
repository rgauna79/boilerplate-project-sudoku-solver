class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";
    if (puzzleString.length !== 81)
      return "Expected puzzle to be 81 characters long";
    if (/[^1-9.]/g.test(puzzleString)) return "Invalid characters in puzzle";
    return "Valid";
  }

  letterToNumber(row) {
    switch (row) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    let startRow = row - (row % 3),
      startCol = column - (column % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == value) return false;
      }
    }
    return true;
  }

  sudokuStringToBoard(sudokuString) {
    const SIZE = 9; // Size of the Sudoku board
    const board = [];

    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        const index = i * SIZE + j;
        const value = sudokuString.charAt(index);
        row.push(value === "." ? 0 : parseInt(value));
      }
      board.push(row);
    }

    return board;
  }

  solveSudoku(board) {
    const N = 9; // Size of the Sudoku board

    // Find an empty cell (unassigned)
    function findEmptyCell() {
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          if (board[row][col] === 0) {
            return { row, col };
          }
        }
      }
      return null;
    }

    // Check if a number can be placed in a given position
    function isSafe(row, col, num) {
      // Check if the number is not in the same row or column
      for (let i = 0; i < N; i++) {
        if (board[row][i] === num || board[i][col] === num) {
          return false;
        }
      }

      // Check if the number is not in the same 3x3 subgrid
      const subgridStartRow = row - (row % 3);
      const subgridStartCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[subgridStartRow + i][subgridStartCol + j] === num) {
            return false;
          }
        }
      }

      return true;
    }

    // Recursive function to solve the Sudoku puzzle
    function solve() {
      const emptyCell = findEmptyCell();

      if (!emptyCell) {
        // No empty cell, the Sudoku is solved
        return true;
      }

      const { row, col } = emptyCell;

      for (let num = 1; num <= N; num++) {
        if (isSafe(row, col, num)) {
          // Try placing the number
          board[row][col] = num;

          // Recursively solve the rest of the puzzle
          if (solve()) {
            return true;
          }

          // If placing the number leads to an invalid solution, backtrack
          board[row][col] = 0;
        }
      }

      // No valid number can be placed in this cell, backtrack
      return false;
    }

    // Start solving the puzzle
    if (solve()) {
      return board;
    } else {
      // If no solution is found
      return false;
    }
  }

  completeSoduku(puzzleString) {
    const board = this.sudokuStringToBoard(puzzleString);
    const solvedBoard = this.solveSudoku(board);
    if (!solvedBoard) {
      return;
    }
    const flattenedString = solvedBoard.flat().join("");
    return flattenedString;
  }
}

module.exports = SudokuSolver;
