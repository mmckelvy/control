'use strict';

const path = require('path');
const testDir = path.join(process.cwd(), 'test');

const testRunSeries = require(path.join(testDir, 'run-series.js'));
const testRunParallel = require(path.join(testDir, 'run-parallel.js'));

testRunSeries();
testRunParallel();
