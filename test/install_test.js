var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('install', function() {
  var install;
  var shellStub;

  beforeEach(function() {
    shellStub = {};
    install = proxyquire('../lib/install', { shelljs: shellStub });
  });

  describe('isInstalled()', function() {
    it('should determine that nginx is installed', function() {
      shellStub.which = sinon.stub().returns('/opt/nginx/bin/nginx');

      expect(install.isInstalled()).to.be.true();
    });

    it('should not fail when nginx is not installed', function() {
      shellStub.which = sinon.stub().returns(null);

      expect(install.isInstalled()).to.be.false();
    });
  });
});
