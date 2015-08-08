'use strict';

var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var childProcess = require('child_process');
var isRelative = require('./util').isRelative;
var configGenerator = require('./config_generator');

exports.start = function(config) {
  // the nginx config and log files will go to a temporary location
  // that needs to be unique. The tmpDir should be made available to the
  // caller for inspection of logs etc.
  var tmpDir = path.join('/tmp/proxrox', uuid.v4());
  mkdirp.sync(tmpDir);

  // Expose the tmpDir to the config generator so that we can control
  // proxy and client body tmp file locations. This is important as some
  // nginx installation's default tmp file locations require super user
  // priviledges. We do not want users to use sudo for proxrox usage!
  config.tmpDir = tmpDir;

  // create the config and write it to the previously generated dir
  var configPath = path.join(tmpDir, 'nginx.conf');
  var nginxConf = configGenerator.generate(config);
  fs.writeFileSync(configPath, nginxConf);

  // we need to ensure that the log directory is existing
  var logDir;
  if (isRelative(config.logDir)) {
    logDir = path.join(tmpDir, config.logDir);
  } else {
    logDir = config.logDir;
  }
  mkdirp.sync(logDir);

  // these directories need to exist as well.
  mkdirp.sync(path.join(tmpDir, 'clientBody'));
  mkdirp.sync(path.join(tmpDir, 'proxy'));

  // the mime types are referenced by the nginx config and need to be located
  // on the relative nginx path (which is the tmpDir).
  fs.copySync(
    path.join(__dirname, 'mime.types'),
    path.join(tmpDir, 'mime.types')
  );

  if (config.tls) {
    createCertificates(tmpDir);
  }

  var spawnResult = childProcess.spawnSync('nginx',
      ['-c', configPath, '-p', tmpDir]);
  if (spawnResult.error) {
    throw new Error('Failed to start the server: ' + spawnResult.error);
  }
  if (!spawnResult.status === 0) {
    throw new Error('Failed to start the server.');
  }

  return {
    path: tmpDir
  };
};

exports.stop = function() {
  childProcess.spawnSync('pkill', ['-f', 'nginx: master process']);
};

function createCertificates(tmpDir) {
  var keyPath = path.join(tmpDir, 'server.key');
  execAndCheck(
    'openssl genrsa -des3 -out ' + keyPath + ' -passout pass:temp 2048',
    true
  );

  var signingRequestPath = path.join(tmpDir, 'server.csr');
  execAndCheck(
    'openssl req -new -key ' + keyPath + ' -out ' + signingRequestPath +
      ' -passin pass:temp -batch',
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
}

function execAndCheck(command, silent) {
  // passing an empty array for option stdio results in silencing the command,
  // that is, do not echo stdout/stderr of the child process
  var options = silent ? { stdio: [] } : {};
  childProcess.execSync(command, options);
}
