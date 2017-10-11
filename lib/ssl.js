var os = require('os');
var childProcess = require('child_process');
var path = require('path');

exports.createCertificates = function createCertificates(tmpDir) {
  var keyPath = path.join(tmpDir, 'server.key');
  var hostname = os.hostname();

  execAndCheck(
    'openssl genrsa -des3 -out ' + keyPath + ' -passout pass:temp 2048',
    true
  );

  var signingRequestPath = path.join(tmpDir, 'server.csr');
  execAndCheck(
    'openssl req -new -key ' + keyPath + ' -out ' + signingRequestPath +
    ' -passin pass:temp -batch -subj "/OU=' + hostname + '"',
    true
  );

  // remove the password
  execAndCheck(
    'openssl rsa -in ' + keyPath + ' -out ' + keyPath + ' -passin pass:temp',
    true
  );

  var certificatePath = path.join(tmpDir, 'server.crt');
  execAndCheck(
    'openssl x509 -req -days 365 -in ' + signingRequestPath + ' -signkey ' +
    keyPath + ' -out ' + certificatePath,
    true
  );
};

function execAndCheck(command, silent) {
  // passing an empty array for option stdio results in silencing the command,
  // that is, do not echo stdout/stderr of the child process
  var options = silent ? { stdio: [] } : {};
  childProcess.execSync(command, options);
}
