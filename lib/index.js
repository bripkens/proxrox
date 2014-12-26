'use strict';

var path = require('path');
var fs = require('fs');
var os = require('os');
var Promise = require('bluebird');
var shell = require('shelljs');

var installers = {
  darwin: installOnOSX
};

function install() {
  var platform = os.platform();
  if (!installers.hasOwnProperty(platform)) {
    var msg = 'Nginx cannot be automatically installed for platform ' +
      platform + '.';
    return Promise.reject(new Error(msg));
  }

  return installers[platform]();
}

function installOnOSX() {
  if (!shell.which('brew')) {
    return Promise.reject(new Error('Automatic installation requires the ' +
      'Homebrew package manager for OS X. Please install Homebrew. See ' +
      'http://brew.sh/ for instructions.'));
  }

  return new Promise(function(resolve, reject) {
    shell.exec('brew update && brew install nginx --with-spdy',
        function(code, output) {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('nginx installation failed with code ' + code +
          '. The following output was produced: \n' + output));
      }
    });
  });
}

function toFullpath(p, type, required) {
  var fp = path.resolve(p);
  if (fs.existsSync(fp) || !required) {
    return fp;
  }
  var error = ' (' + type + ' path): is required, but invalid.'
  throw fp + error;
}
