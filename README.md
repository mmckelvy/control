# control
Minimal async flow control functions

# Installation
`npm install control`

# Examples
```
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

// runParallel syntax is exactly the same as runSeries (though results are not exposed along the way):
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

  else console.log(results); // --> [4, 6, 8] (order not guaranteed!)
});
```

# Methodology
These are the bare essentials for async control flow: run an array of async functions in series or run them in parallel.  Running functions in series allows you to access results along the way (waterfall) and exit early if something goes wrong. Running in parallel gives you a speed boost but does not allow for interim access to results or an early exit on error.

Most async tasks can be adequately managed with either of these two methods.

# Test
`npm test` to run the unit tests.
To run tests in dev mode (so you can see console.logs and all the subtest checks) run `npm run dev-test`.

# API
### `runSeries(fns, done)`

### Params
#### `fns`
`{Array}` An array of functions to run. Each function takes a required `callback` {Function} and optional `results` {Array}. `callback` should be invoked on completion of your async operation. See examples above.

#### `done`
`{Function}` A final callback function to invoke once all scheduled functions have completed. Will be invoked immediately with an error if any scheduled function errors (and no subsequent functions will be run), otherwise will be invoked with the final `results` array (see examples above).

### `runParallel`
Same api as `runSeries` except interim results (`results`) are not available in `runParallel`. `results` are only available in the final `done` callback.

```
control.runParallel([
  ...
  function(callback, results) {
    console.log(results); // undefined
  }
  ...
], function(err, results) {
  if (err) console.log(err);
  else console.log(results) // This will work.
});
```
All functions are launched immediately and there is no guarantee the results will be in any particular order. If an error occurs, all results will be discarded and `done` will be invoked with the error. Note that unlike `runSeries` all functions will still be executed even if one errors out.

Finally, care should be taken to avoid exhausting system resources when launching a large number of expensive tasks in parallel.

# License
MIT
