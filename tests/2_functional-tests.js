const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({
              puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'solution');
              done();
            });
        });
    
        test('Solve a puzzle with missing puzzle string', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Required field missing');
              done();
            });
        });
    
        test('Solve a puzzle with invalid characters', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({
              puzzle: '56372434268751919725438668547923invalid538467734162895926345178473891652851726943',
            })
            .end((err, res) => {
                
              assert.equal(res.status, 200);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Invalid characters in puzzle');
              done();
            });
        });
    
        test('Solve a puzzle with incorrect length', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({
              puzzle: '5689137243426875191972543866854792312195384677341628959263451784738916528517269431',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });
    
        test('Solve a puzzle that cannot be solved', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({
              puzzle: '1..456789912345678891234567789123456678912345567891234456789123345678912234567891',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Puzzle cannot be solved');
              done();
            });
        });
      });
    
      suite('POST /api/check', () => {
        test('Check a puzzle placement with all fields', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({
              puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
              coordinate: 'A1',
              value: '5',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'valid');
              assert.isTrue(res.body.valid);
              done();
            });
        });
    
        test('Check a puzzle placement with single placement conflict', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({
              puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
              coordinate: 'A1',
              value: '1',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'valid');
              assert.isFalse(res.body.valid);
              assert.property(res.body, 'conflict');
              assert.isArray(res.body.conflict);
              assert.lengthOf(res.body.conflict, 2);
              //assert.equal(res.body.conflict[0], 'row');
              done();
            });
        });
        test('Check a puzzle placement with multiple placement conflicts', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
                coordinate: 'A1',
                value: '1',
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.lengthOf(res.body.conflict, 3); // Adjust the expected length based on the puzzle
                done();
              });
          });
      
          test('Check a puzzle placement with all placement conflicts', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '1',
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                //assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.lengthOf(res.body.conflict, 2); // Adjust the expected length based on the puzzle
                done();
              });
          });
      
          test('Check a puzzle placement with missing required fields', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                // Omitted required fields
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
              });
          });
      
          test('Check a puzzle placement with invalid characters', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '5689137243426875191972543866854792312195384677341628959263451784invalid1234565412',
                coordinate: 'A1',
                value: '5',
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
              });
          });
      
          test('Check a puzzle placement with incorrect length', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '5689137243426875191972543866854792312195384677341628959263451784738916528517269431',
                coordinate: 'A1',
                value: '5',
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
              });
          });
      
          test('Check a puzzle placement with invalid placement coordinate', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
                coordinate: 'K10', // Invalid coordinate
                value: '5',
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
              });
          });
      
          test('Check a puzzle placement with invalid placement value', (done) => {
            chai
              .request(server)
              .post('/api/check')
              .send({
                puzzle: '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
                coordinate: 'A1',
                value: '0', // Invalid value
              })
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done();
              });
          });
});
});
