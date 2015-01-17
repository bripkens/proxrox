'use strict';

var expect = require('chai').expect;
var util = require('../lib/util');

describe('util', function() {

  describe('isRelative', function() {
    it('should identify relative paths', function() {
      expect(util.isRelative('../foo')).to.be.true;
      expect(util.isRelative('foo')).to.be.true;
      expect(util.isRelative('./foo')).to.be.true;
    });

    it('should identify absolute paths', function() {
      expect(util.isRelative('/foo')).to.be.false;
      expect(util.isRelative(process.cwd())).to.be.false;
    });
  });

});
