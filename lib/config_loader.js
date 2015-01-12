'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

/**
 * Load and parse a YAML config object from a file.
 * @param {string} filePath the path to the YAML config file
 * @returns {Object} the parsed config object
 */
exports.loadConfig = function(filePath) {
  try {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' +
      e.message;
    throw e;
  }
};
