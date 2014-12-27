'use strict';

var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var configGenerator = require('../lib/config_generator');

var config = {
  ssl: true,
  gzip: true,
  spdy: true,
  ssi: true,
  proxy: 'http://127.0.0.1:8080',
  port: 4000,
  serverName: 'localhost',
  root: path.join(__dirname, 'static')
};

describe('config_generator', function() {
  describe('generate(config)', function() {
    it('should support simple http serving', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs'
      }, 'simple.conf');
    });
  });
});

function testConfig(config, expectedPath) {
  var expected = fs.readFileSync(
    path.join(__dirname, 'expectedConfigs', expectedPath),
    { encoding: 'utf8' }
  );
  assertWithDiff(configGenerator.generate(config), expected);
}
