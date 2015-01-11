'use strict';

var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var shell = require('shelljs');
var util = require('util');
var configGenerator = require('./config_generator');

var exec = shell.exec;

exports.start = function(config) {
  // the nginx config and log files will go to a temporary location
  // that needs to be unique. The tmpDir should be made available to the
  // caller for inspection of logs etc.
  var tmpDir = path.join('/tmp/proxrox', uuid.v4());
  mkdirp.sync(tmpDir);

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

  // the mime types are referenced by the nginx config and need to be located
  // on the relative nginx path (which is the tmpDir).
  fs.copySync(
    path.join(__dirname, 'mime.types'),
    path.join(tmpDir, 'mime.types')
  );

  if (config.tls) {
    createCertificates(tmpDir);
  }

  var code = exec('nginx -c ' + configPath + ' -p ' + tmpDir).code;
  if (code !== 0) {
    throw new Error('Failed to start the server');
  }

  var pidFile = path.join(logDir, 'nginx.pid');
  var pid = parseInt(fs.readFileSync(pidFile, {encoding: 'utf8'}).trim());
  return {
    path: tmpDir,
    pid: pid
  };
};


exports.stop = function() {
  return exec('pkill -f "nginx: master process"').code === 0;
};

function isRelative(p) {
  var normal = path.normalize(p);
  var absolute = path.resolve(p);
  return normal !== absolute;
}

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

function execAndCheck(cmd, silent) {
  if (arguments.length === 1) {
    silent = false;
  }
  var result = exec(cmd, {silent: silent});
  if (result.code !== 0) {
    var err = util.format("Command '%s' failed. Output: %s", cmd, result.output);
    throw new Error(err);
  }
}
