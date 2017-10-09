var expect = require('chai').expect;
var proxyquire = require('proxyquire');
var fs = require('fs');

describe('openssl', function() {
  var control;

  var osStub;
  var childProcessStub;

  beforeEach(function() {
    childProcessStub = {};
    osStub = {
      hostname: function(){
        return 'some Name';
      }
    };
    control = proxyquire('../lib/control', {
      'child_process': childProcessStub,
      os: osStub
    });
  });

  describe('cert generation', function() {
    it('should generate a certificate', function(){
      control.createCertificates('./');

      expect(removeGeneratedFiles()).to.be.true;
    });
  });
});

function removeGeneratedFiles(){
  var expectedFiles = ['server.crt', 'server.key', 'server.csr'];
  var success = true;
  expectedFiles.forEach(function(file){
    fs.unlinkSync('./'+file,function(err){
      if(err) success = false;
      console.error('Could not delete '+file, err);
    });
  });

  return success;
}
