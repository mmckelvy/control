'use strict';

const test = require('tape');
const control = require('../index');

function testRunSeries() {
  test('runSeries() -- should run each function passed in with correct results', function(t) {

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

  test('runSeries() -- should return early if function returns an error', function(t) {
    // Simulated async function to run
    function asyncFn(param, callback) {
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
        t.fail('should not continue running functions');
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
}

module.exports = testRunSeries;
