'use strict';

var path = require('path');
var fs = require('fs');

var configGenerator = require('../lib/config_generator');

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

    it('should support directory indices', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs',
        directoryIndex: true
      }, 'directoryIndex.conf');
    });

    it('should support gzip', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs',
        gzip: true
      }, 'gzip.conf');
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
