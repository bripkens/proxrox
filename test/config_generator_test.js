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
        logDir: '/tmp/nginx-logs/'
      }, 'simple.conf');
    });

    it('should support directory indices', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        directoryIndex: true
      }, 'directoryIndex.conf');
    });

    it('should support gzip', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        gzip: true
      }, 'gzip.conf');
    });

    it('should proxy requests', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: 'http://127.0.0.1:8080'
      }, 'proxy.conf');
    });

    it('should support ssi', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        ssi: true
      }, 'ssi.conf');
    });

    it('should support tls', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        tls: true
      }, 'tls.conf');
    });

    it('should support spdy', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        tls: true,
        spdy: true
      }, 'spdy.conf');
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
