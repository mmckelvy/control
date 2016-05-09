# control
Minimal async flow control functions

# Installation
`npm install control`

# Examples
    // Some async function...
    function asyncFn(param, cb) {
      setTimeout(function() {
        cb(null, param * 2);
      }, 1000);
    }

    // ...using control.runSeries:
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
    ], function(err, results) {
      if (err) console.log(err);

      else console.log(results); // --> [4, 6, 8]
    });

    // Optionally access results along the way to create a "waterfall" approach:
    control.runSeries([
      function(callback) {
        asyncFn(2, callback);
      },
      function(callback, results) {
        console.log(results); // [4]
        asyncFn(results[0], callback);
      },
      function(callback) {
        console.log(results); // [4, 8]
        asyncFn(results[1], callback);
      }
    ], function(err, results) {
      if (err) console.log(err);

      else console.log(results); // --> [4, 8, 16]
    });

    // runParallel syntax is exactly the same as runSeries:
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
    ], function(err, results) {
      if (err) console.log(err);

      else console.log(results); // --> [4, 6, 8]
    });

