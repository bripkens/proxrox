'use strict';

var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;

var configGenerator = require('../lib/config_generator');

describe('config_generator', function() {
  describe('generate(config)', function() {
    it('should support simple http serving', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/'
      }, 'simple.conf');
    });

    it('should support directory indices', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        directoryIndex: true
      }, 'directoryIndex.conf');
    });

    it('should support gzip', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        gzip: true
      }, 'gzip.conf');
    });

    it('should proxy requests', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: 'http://127.0.0.1:8080'
      }, 'proxy.conf');
    });

    it('should support ssi', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        ssi: true
      }, 'ssi.conf');
    });

    it('should support tls', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        tls: true
      }, 'tls.conf');
    });

    it('should support spdy', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
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
        standardServer: true,
        tmpDir: '/tmp/proxrox',
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
        standardServer: true,
        tmpDir: '/tmp/proxrox',
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
        standardServer: true,
        tmpDir: '/tmp/proxrox',
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
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        websocketProxy: {
          '/api/data': 'http://api.example.com/api/foo'
        }
      }, 'websocket_proxy.conf');
    });

    it('should proxy with ssi', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        ssi: true,
        proxy: {
          '/': 'http://127.0.0.1:3000',
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com'
        }
      }, 'proxies_with_ssi.conf');
    });

    it('should support HTTP2', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        http2: true
      }, 'http2.conf');
    });

    it('should support HTTP2 with tls', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        http2: true,
        tls: true
      }, 'http2_with_tls.conf');
    });

    it('should support stub status', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        stubStatus: true
      }, 'stubStatus.conf');
    });

    it('should add an extra site', function() {
      testConfig({
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        stubStatus: true,
        extraSite: 'server {\n  listen 123;\n}'
      }, 'extraSite.conf');
    });

    it('should only have the extra site', function() {
      testConfig({
        standardServer: false,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        stubStatus: true,
        extraSite: 'server {\n  listen 123;\n}'
      }, 'extraSiteOnly.conf');
    });

    it('should fail when only tlsCertificateFile is set', function() {
      var invalid = {tlsCertificateFile: '.abc/'}

      expect(function() {configGenerator.generate(invalid)}).to.throw(Error);
    });

    it('should fail when only tlsCertificateKeyFile is set', function() {
      var invalid = {tlsCertificateKeyFile: '.abc/'}

      expect(function() {configGenerator.generate(invalid)}).to.throw(Error);
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
