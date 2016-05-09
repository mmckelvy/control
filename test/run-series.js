'use strict';

const test = require('tape');
const control = require('../index');

function testRunSeries() {
  test('runSeries() -- should run each function passed in with correct results', function(t) {
    const start = Date.now();

    function asyncFn(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback(null, param * 2);
      }, 1000);
    }

    function final(err, results) {
      if (err) {
        t.fail('Returned an error when should have returned results');
        t.end();

      } else {

        const end = Date.now();
        console.log(`Time elapsed: ${end - start}`);

        console.log(`HERE ARE THE RESULTS: ${results.join(', ')}`);

        t.deepEqual(
          results,
          [4, 6, 8],
          'Should return the correct results'
        );
        t.end();
      }
    }

    control.runSeries([
      function(callback) {
        asyncFn(2, callback);
      },
      function(callback) {
        asyncFn(3, callback);
      },
      function(callback) {
        asyncFn(4, callback);
      }
    ], final);
  });

  test('runSeries() -- should invoke "done" early if any function returns an error', function(t) {
    function asyncFn(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback(null, param * 2);
      }, 1000);
    }

    function asyncErr(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback('Error');
      }, 1000);
    }

    function final(err, results) {
      if (err) {
        t.equal(err, 'Error', 'should properly capture the error');
        t.end();

      } else {
        t.fail('Should not continue running functions');
        t.end();
      }
    }

    control.runSeries([
      function(callback) {
        asyncErr(2, callback);
      },
      function(callback) {
        asyncFn(3, callback);
      },
      function(callback) {
        asyncFn(4, callback);
      }
    ], final);
  });

  test('runSeries() -- should expose results to subsequent function calls', function(t) {
    const start = Date.now();

    function asyncFn(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback(null, param * 2);
      }, 1000);
    }

    function final(err, results) {
      if (err) {
        t.fail('Returned an error when should have returned results');
        t.end();

      } else {
        const end = Date.now();
        console.log(`Time elapsed: ${end - start}`);

        console.log(`HERE ARE THE RESULTS: ${results.join(', ')}`);

        t.deepEqual(
          results,
          [4, 8, 16],
          'Should return the correct results'
        );
        t.end();
      }
    }

    control.runSeries([
      function(callback) {
        asyncFn(2, callback);
      },
      function(callback, results) {
        t.equal(results[0], 4, 'Should expose the results');
        asyncFn(results[0], callback);
      },
      function(callback, results) {
        t.equal(results[1], 8, 'Should expose the results');
        asyncFn(results[1], callback);
      }
    ], final);
  });
}

module.exports = testRunSeries;
