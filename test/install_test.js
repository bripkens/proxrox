'use strict';

var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('install', function() {
  var install;
  var shellStub;
  var childProcessStub;
  var osStub;

  beforeEach(function() {
    shellStub = {};
    childProcessStub = {};
    osStub = {};
    install = proxyquire('../lib/install', {
      'child_process': childProcessStub,
      shelljs: shellStub,
      os: osStub
    });
  });

  describe('isInstalled()', function() {
    it('should determine that nginx is installed', function() {
      shellStub.which = sinon.stub().returns('/opt/nginx/bin/nginx');

      expect(install.isInstalled()).to.be.true;
    });

    it('should not fail when nginx is not installed', function() {
      shellStub.which = sinon.stub().returns(null);

      expect(install.isInstalled()).to.be.false;
    });
  });

  describe('install()', function() {
    it('should fail for platforms != darwin', function() {
      osStub.platform = sinon.stub().returns('win');
      var reason = /cannot be automatically installed for platform/;
      return expect(install.install()).to.be.rejectedWith(reason);
    });

    describe('for darwin platforms', function() {
      beforeEach(function() {
        osStub.platform = sinon.stub().returns('darwin');
      });

      it('should fail when Homebrew is not installed', function() {
        shellStub.which = sinon.stub().returns(null);
        var reason = /requires the Homebrew package manager/;
        return expect(install.install()).to.be.rejectedWith(reason);
      });

      it('should fail when homebrew installation fails', function() {
        shellStub.which = sinon.stub().returns('/usr/local/bin/brew');
        childProcessStub.exec = function(cmd, cb) {
          expect(cmd).to.match(/brew install/);
          process.nextTick(cb.bind(null, new Error('precondition error')));
        };
        var reason = /precondition error/;
        return expect(install.install()).to.be.rejectedWith(reason);
      });

      it('should work when homebrew install is successful', function() {
        shellStub.which = sinon.stub().returns('/usr/local/bin/brew');
        childProcessStub.exec = function(cmd, cb) {
          expect(cmd).to.match(/brew install/);
          process.nextTick(cb.bind(null, null));
        };
        return expect(install.install()).to.be.fulfilled;
      });
    });
  });
});
