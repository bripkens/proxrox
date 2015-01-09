'use strict';

var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

ejs.filters.toBool = function(v) {
  return v ? 'on' : 'off';
};

var rawTemplate = fs.readFileSync(
  path.join(__dirname, 'config_template.ejs'),
  { encoding: 'utf8' }
);
var compiledTemplate = ejs.compile(rawTemplate, {open: '{{', close: '}}'});

exports.generate = function(config) {
  config.directoryIndex = config.directoryIndex || false;
  config.gzip = config.gzip || false;
  return compiledTemplate(config);
};
