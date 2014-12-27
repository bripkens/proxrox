var expect = require('chai').expect;
var proxyquire = require('proxyquire');

describe('install', function() {
  describe('isInstalled()', function() {
    var install;
    var shellStub;

    beforeEach(function() {
      shellStub = {};
      install = proxyquire('../lib/install', { shelljs: shellStub });
    });

    it('should determine that nginx is installed', function() {
      shellStub.which = function() { return '/opt/nginx/bin/nginx' };

      expect(install.isInstalled()).to.be.true();
    });

    it('should determine that nginx is installed', function() {
      shellStub.which = function() { return '/opt/nginx/bin/nginx' };

      expect(install.isInstalled()).to.be.true();
    });

    it('should not fail when nginx is not installed', function() {
      shellStub.which = function() { return null };

      expect(install.isInstalled()).to.be.false();
    });
  });
});
