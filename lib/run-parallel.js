'use strict';

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
