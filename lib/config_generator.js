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

/*eslint-disable complexity */
exports.generate = function(config) {
  config.directoryIndex = config.directoryIndex || false;
  config.gzip = config.gzip || false;
  config.ssi = config.ssi || false;
  config.tls = config.tls || config.spdy || false;
  config.spdy = config.spdy || false;
  config.http2 = config.http2 || false;
  config.websocketProxy = config.websocketProxy || {};

  if (config.spdy && config.http2) {
    throw new Error('SPDY and HTTP 2 cannot be active at the same time.');
  }

  normalizeProxy(config);

  return compiledTemplate(config);
};
/*eslint-enable */

function normalizeProxy(config) {
  config.proxy = config.proxy || {};
  if (typeof config.proxy === 'string') {
    config.proxy = {
      '/': config.proxy
    };
  }
}
