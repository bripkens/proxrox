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
      'Homebrew package manager for OS X. Please install Homebrew. See ' +
      'http://brew.sh/ for instructions.'));
  }

  return new Promise(function(resolve, reject) {
    var command = 'brew tap homebrew/nginx && ' +
      'brew update && ' +
      'brew install nginx-full --with-gzip-static --with-status --with-spdy';
    childProcess.exec(
      command,
      function(error, stdout, stderr) {
        // echo any output of install commands to our own stdout/stderr
        console.log(stdout);
        console.error(stderr);
        if (error) {
          console.error('nginx installation failed');
          reject(error);
        } else {
          resolve();
        }
      });
  });
}
