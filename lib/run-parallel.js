'use strict';

/**
* @function: runParallel
*
* @param: fns {Array} An array of functions to run. Each function needs to take
* a callback {Function} argument that conforms to usual (error, result) signature.
*
* @param: done {Function} A final callback with an (error, results) signature to run once
* all fns in the series have completed. Results from previous function calls will be available
* in "results".
*
* If any function encounters an error, "done" will be called immediately with the error.
*/
function runParallel(fns, done) {
  const results = [];
  var count = 0;
  var end = false;

  fns.forEach(function(fn) {
    fn(function(err, result) {
      count++
      results.push(result);

      if (err && !end) {
        done(err);
        end = true;
      }

      else if (count === fns.length && !end) {
        done(null, results);
        end = true;
      }
    });
  });
}

module.exports = runParallel;
