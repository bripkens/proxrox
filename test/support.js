require('colors');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var jsdiff = require('diff');

chai.expect();
chai.use(chaiAsPromised);

global.assertWithDiff = function(actual, expected) {
  if (actual === expected) {
    return;
  }

  var msg = 'Differences between expected and actual result:\n'.red;
  var diff = jsdiff.diffChars(expected, actual);

  diff.forEach(function(part) {
    // green for additions, red for deletions grey for common parts
    var color = part.added ? 'red' : part.removed ? 'red' : 'grey';
    msg += part.value[color];
  });

  msg += '\n';

  throw new Error(msg);
};
