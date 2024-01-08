"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

let solver = new SudokuSolver();

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      return res.json({ valid: false, error: "Required field(s) missing" });
    }
    let conflict = [];
    let valid = false;
    let row, column;
    if (coordinate && coordinate.length === 2) {
      row = coordinate.charAt(0).toUpperCase();
      column = coordinate.charAt(1);
    } else {
      return res.json({ valid: false, error: "Invalid coordinate" });
    }
    if (solver.validate(puzzle) !== "Valid") {
      return res.json({ valid: false, error: solver.validate(puzzle) });
    }

    if (!/^[a-i][1-9]$/i.test(coordinate)) {
      res.json({ valid: false, error: "Invalid coordinate" });
      return;
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ valid: false, error: "Invalid value" });
    }
    let index = (solver.letterToNumber(row) - 1) * 9 + (+column - 1);

    if (puzzle[index] == value) {
      res.json({ valid: true });
      return;
    }

    let rowPlacement = solver.checkRowPlacement(puzzle, row, column, value);
    let colPlacement = solver.checkColPlacement(puzzle, row, column, value);
    let regPlacement = solver.checkRegionPlacement(puzzle, row, column, value);

    if (rowPlacement && colPlacement && regPlacement) {
      res.json({ valid: true });
    } else {
      if (!rowPlacement) {
        conflict.push("row");
      }
      if (!colPlacement) {
        conflict.push("column");
      }
      if (!regPlacement) {
        conflict.push("region");
      }
      res.json({ valid: false, conflict: conflict });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (solver.validate(puzzle) !== "Valid") {
      return res.json({ error: solver.validate(puzzle) });
    }
    const solution = solver.completeSoduku(puzzle);

    if (!solution) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution });
    }
  });
};
