'use strict';

const test = require('tape');
const control = require('../index');

function testRunParallel() {
  test('runParallel() -- should run each function passed in with correct results', function(t) {

    // For measurement of duration.
    const start = Date.now();

    // Simulated async function to run
    function asyncFn(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback(null, param * 2);
      }, 1000);
    }

    // Function to pass for done
    function final(err, results) {
      if (err) {
        t.fail('Returned an error when should have returned results');
        t.end();

      } else {

        // Measure elapsed time.
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

    control.runParallel([
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

  test('runParallel() -- should invoke "done" with error if any function returns an error', function(t) {

    // Simulated async function to run
    function asyncFn(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback(null, param * 2);
      }, 1000);
    }

    // Simulated async function to run
    function asyncErr(param, callback) {
      console.log(`Doing async stuff with ${param}`);

      setTimeout(function() {
        callback('Error');
      }, 1000);
    }

    // Function to pass for done
    function final(err, results) {
      if (err) {
        t.equal(err, 'Error', 'Should properly capture the error');
        t.end();

      } else {
        t.fail('Should not invoke "done" with results');
        t.end();
      }
    }

    control.runParallel([
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
}

module.exports = testRunParallel;
