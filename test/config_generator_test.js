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

    it('should support multiple proxies', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com'
        }
      }, 'proxies.conf');
    });

    it('should work without root proxy', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com'
        }
      }, 'proxies_without_try_files.conf');
    });

    it('should proxy on root without static asset serving', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/': 'http://127.0.0.1:3000',
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com'
        }
      }, 'proxies_without_static_asset_serving.conf');
    });

    it('should proxy with websocket upgrade support', function() {
      testConfig({
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        websocketProxy: {
          '/api/data': 'http://api.example.com/api/foo'
        }
      }, 'websocket_proxy.conf');
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
