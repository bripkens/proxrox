'use strict';

var childProcess = require('child_process');
var os = require('os');
var Promise = require('bluebird');
var shell = require('shelljs');

var installers = {
  darwin: installOnOSX
};

exports.isInstalled = function() {
  return !!shell.which('nginx');
};

exports.install = function() {
  var platform = os.platform();
  if (!installers.hasOwnProperty(platform)) {
    var msg = 'Nginx cannot be automatically installed for platform ' +
      platform + '.';
    return Promise.reject(new Error(msg));
  }

  return installers[platform]();
};

function installOnOSX() {
  if (!shell.which('brew')) {
    return Promise.reject(new Error('Automatic installation requires the ' +
      'Homebrew package manager for MacOS. Please install Homebrew. See ' +
      'http://brew.sh/ for instructions.'));
  }

  return new Promise(function(resolve) {
    // Okay, now this is fairly dumb. We don't actually need promises here when
    // we are executing the command synchronously. Given the current
    // installation use cases though, synchronous is okay. Will need to
    /// revise this once we have more than a single supported
    // installation target or async installation becomes necessary.
    var command = 'brew update && brew install nginx';
    childProcess.execSync(
      command,
      {
        stdio: 'inherit'
      }
    );
    resolve();
  });
}
