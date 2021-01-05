'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      return res.json(solver.check(req.body.puzzle, req.body.coordinate, req.body.value))
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      var puzStr = req.body.puzzle

      //res.json(solver.validate(req.body.puzzle))

    });
};
