const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {
    suite("Logic Handles test", function(){
        test("Valid puzzle string of 81 characters", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
            assert.equal(solver.validate(puzzleString),"Valid")
            
        })

        test("Puzzle string with invalid characters", function(){
            let invalidString = '56891372434268751919725438668547923121953846773416289592634517847389165285invalid';
            assert.equal(solver.validate(invalidString),"Invalid characters in puzzle")
        })

        test("Puzzle string not 81 characters in length", function(){
            let shortString = '123456789';
            assert.equal(solver.validate(shortString), "Expected puzzle to be 81 characters long");
        });

        test("Valid row placement:", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
            assert.isFalse(solver.checkRowPlacement(puzzleString, 'A', 1, 5));
        });

        test("Invalid row placement", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            assert.isFalse(solver.checkRowPlacement(puzzleString, 'A', 1, 5));
        });

        test("Valid column placement:", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
            assert.isFalse(solver.checkColPlacement(puzzleString, 'A', 1, 5));
        });

        test("Invalid column placement", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            assert.isFalse(solver.checkColPlacement(puzzleString, 'A', 1, 1));
        });

        test("Valid region (3x3 grid) placement:", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
            assert.isFalse(solver.checkRegionPlacement(puzzleString, 'A', 1, 2));
        });

        test("Invalid region (3x3 grid) placement", function(){
            let puzzleString = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            assert.isFalse(solver.checkRegionPlacement(puzzleString, 'A', 1, 1));
        });

        test("Valid puzzle strings pass the solver", function(){
            let validPuzzle = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            assert.deepEqual(solver.solveSudoku(solver.sudokuStringToBoard(validPuzzle)), solver.sudokuStringToBoard(validPuzzle));
        });

        test("Invalid puzzle strings fail the solver:", function(){
            let invalidPuzzle = '56891372434268751919725438668547923121953846773416289592634517847389165285invalid';
            assert.isNotNull(solver.solveSudoku(solver.sudokuStringToBoard(invalidPuzzle)));
        });

        test("Solver returns the expected solution for an incomplete puzzle", function(){
            let incompletePuzzle = '568913724342687519197254386685479231219538467734162895926345178473891652851726940';
            let expectedSolution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            assert.deepEqual(solver.solveSudoku(solver.sudokuStringToBoard(incompletePuzzle)), solver.sudokuStringToBoard(expectedSolution));
        });
    })
});
