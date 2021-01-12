const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

//Chai cheat sheet can be found here : https://devhints.io/chai

chai.use(chaiHttp);

suite('Functional Tests', function() {

    var expect = chai.expect
    var puzStr = ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    
    suite('POST /api/solve', function() {

        test('Solve a puzzle with valid puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle:"." + puzStr})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, "769235418851496372432178956174569283395842761628713549283657194516924837947381625")
                done();
            });
        });

        test('Solve a puzzle with missing puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send()
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field missing")
                done();
            });
        });

        test('Solve a puzzle with invalid characters', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle:"A" + puzStr})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle")
                done();
            });
        });
        test('Solve a puzzle with incorrect length', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle: puzStr})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                done();
            });
        });
        test('Solve a puzzle that cannot be solved', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({puzzle:"9" + puzStr})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Puzzle cannot be solved")
                done();
            });
        });
     })

     suite('POST api/check', function() {
        test('Check a puzzle placement with all fields', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A1", value: 7})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.text, '{\"valid\":true}')
                done();
            });
        });

        test('Check a puzzle placement with single placement conflict', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A1", value: "2"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict.length, 1)
                done();
            });
        });

        test('Check a puzzle placement with multiple placement conflicts', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A1", value: "9"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict.length, 2 )
                done();
            });
        });

        test('Check a puzzle placement with all placement conflicts', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A2", value: "5"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict.length, 3)
                done();
            });
        });

        test('Check a puzzle placement with missing required fields', function(done) {
            chai.request(server)
            .post('/api/check')
            .send({puzzle: "." + puzStr, coordinate: "A2"})
            .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field(s) missing")
            done();
            });
        });

        test('Check a puzzle placement with invalid characters', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A2", value: "B"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value")
                done();
            });
        });

        test('Check a puzzle placement with incorrect length', function(done) {
            chai.request(server)
            .post('/api/check')
            .send({puzzle: ".." + puzStr, coordinate: "A2", value: "1"})
            .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
            done();
            });
        });

        test('Check a puzzle placement with invalid placement coordinate', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "Z2", value: "1"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error,"Invalid coordinate")
                done();
            });
        });

        test('Check a puzzle placement with invalid placement value', function(done) {
            chai.request(server)
                .post('/api/check')
                .send({puzzle: "." + puzStr, coordinate: "A2", value: "B"})
                .end((err, res) => {
                if (err) done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value")
                done();
            });
        });
    })
});


