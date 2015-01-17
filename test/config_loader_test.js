'use strict';

var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var yaml = require('js-yaml');

describe('config_loader', function() {
  describe('loadConfig()', function() {
    var configLoader;
    var fsStub;

    beforeEach(function() {
      fsStub = {};
      configLoader = proxyquire('../lib/config_loader', {
        fs: fsStub
      });
    });

    it('should fail when file does not exist', function() {
      fsStub.readFileSync = sinon.stub().throws(new Error('File not found'));

      expect(configLoader.loadConfig.bind(null, 'i-do-not-exist.json'))
        .to.throw(/File not found/);
    });

    it('should support JSON', function() {
      var expected = {hello: 'world'};
      fsStub.readFileSync = sinon.stub().returns(JSON.stringify(expected));

      expect(configLoader.loadConfig('conf.json')).to.deep.equal(expected);
    });

    it('should support YAML', function() {
      var expected = {hello: 'world'};
      fsStub.readFileSync = sinon.stub().returns(yaml.safeDump(expected));

      expect(configLoader.loadConfig('conf.yaml')).to.deep.equal(expected);
      expect(configLoader.loadConfig('conf.yml')).to.deep.equal(expected);
    });

    it('should support comments', function() {
      var data = '{# foo\n"answer": 42}';
      fsStub.readFileSync = sinon.stub().returns(data);
      expect(configLoader.loadConfig('conf.yaml')).to.deep.equal({
        answer: 42
      });
    });
  });
});
