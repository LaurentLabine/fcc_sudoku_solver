const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

var parPuzStr = ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
var puzStr = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."

var expect = chai.expect

suite('UnitTests', () => {

    suite('', function() {

        test('Logic handles a valid puzzle string of 81 characters', function(done) {
            assert.equal(solver.solve(puzStr).solution,"769235418851496372432178956174569283395842761628713549283657194516924837947381625")
            done();
        });
        
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
            assert.equal(solver.solve("A" + parPuzStr).error,"Invalid characters in puzzle")
            done();
        });
        
        test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
            assert.equal(solver.solve(parPuzStr).error,"Expected puzzle to be 81 characters long")
            done();
        });

        test('Logic handles a valid row placement', function(done) {
          assert.equal(solver.check(puzStr, "A2", "6").valid,true)
          done();
        });
        
        test('Logic handles an invalid row placement', function(done) {
          var res = solver.check(puzStr, "A2", "1")
          assert.equal(res.valid,false)
          expect(res.conflict).to.be.an('array').that.include("row");
          done();
        });
        
        test('Logic handles a valid column placement', function(done) {
          assert.equal(solver.check(puzStr, "A2", "6").valid,true)
          done();
        }); 

        test('Logic handles an invalid column placement', function(done) {
          var res = solver.check(puzStr, "A1", "6")
          assert.equal(res.valid,false)
          expect(res.conflict).to.be.an('array').that.include("column");
          done();
        });
            
        test('Logic handles a valid region (3x3 grid) placement', function(done) {
          assert.equal(solver.check(puzStr, "A2", "6").valid,true)
          done();
        });
        
        test('Logic handles an invalid region (3x3 grid) placement', function(done) {
          var res = solver.check(puzStr, "A1", "3")
          assert.equal(res.valid,false)
          expect(res.conflict).to.be.an('array').that.include("region");
          done();
        });
        
        test('Valid puzzle strings pass the solver', function(done) {
          var res = solver.solve(puzStr)
          assert.equal(res.solution,'769235418851496372432178956174569283395842761628713549283657194516924837947381625')
          done();
        });
        
        test('Invalid puzzle strings fail the solver', function(done) {
          var res = solver.solve("9" + parPuzStr)
          assert.equal(res.error,"Puzzle cannot be solved")
          done();
        });
        
        test('Solver returns the the expected solution for an incomplete puzzzle', function(done) {
          var res = solver.solve(puzStr)
          assert.equal(res.solution,'769235418851496372432178956174569283395842761628713549283657194516924837947381625')
          done();
        }); 
    });
});
