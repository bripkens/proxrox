#!/usr/bin/env node

'use strict';

require('colors');
var commander = require('commander');

var install = require('../lib/install');
var control = require('../lib/control');

var program = new commander.Command('nginx.js');

program
  .version(require('../package.json').version);

program
  .command('install')
  .description('Install nginx')
  .action(function() {
    if (install.isInstalled()) {
      return console.log('Nginx is already installed.');
    }

    console.log('Starting installation...');
    install.install()
      .then(function() {
        console.log('Installation successful');
      }, function(error) {
        console.error('Installation failed with error:', error);
      });
  });

program
  .command('start')
  .description('Serve contents of the current directory via nginx')
  .action(function() {
    var port = 4000;
    var config = {
      serverName: 'example',
      port: port,
      root: process.cwd(),
      logDir: 'logs/',
      directoryIndex: true
    };
    var result = control.start(config);

    console.log('Server successfully started'.underline.green);
    console.log('URI:                             http://localhost:%d', port);
    console.log('Nginx config and log location:   %s', result.path);
    console.log('Process ID:                      %d', result.pid);
  });

program
  .command('stop')
  .description('Stop nginx')
  .action(function() {
    if (!control.stop()) {
      console.error('Failed to stop nginx');
    }
  });

program.parse(process.argv);
