'use strict';

/**
* @function: runSeries
*
* Runs a series of asynchronous functions.
*
* @param: fns {Array} An array of functions to run. Each function needs to take
* a callback {Function} argument that conforms to usual (error, result) signature.
* In addition to callback, each fn takes an optional results {Array} param, which will
* expose the ongoing results from previous async calls.
*
* @param: done {Function} A final callback with an (error, results) signature to run once
* all fns in the series have completed. Results from previous function calls will be available
* in "results".
*
* If any function encounters an error, "done" will be called immediately with the error,
* and no other callbacks will be run.
*/
function runSeries(fns, done) {
  const results = [];

  // Callback to invoke on each fn call
  function callback(err, result) {
    if (err) {
      done(err);

    } else {
      results.push(result);
      next();
    }
  }

  // Control invocation of each fn
  function next() {
    const fn = fns.shift();

    if (fn) {

      // Expose results in each fn call for optional "waterfall" approach
      fn(callback, results);

    } else {
      done(null, results);
    }
  }
  next();
}

module.exports = runSeries;
