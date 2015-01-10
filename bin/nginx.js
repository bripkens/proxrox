#!/usr/bin/env node

'use strict';

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
    console.log('Starting...');

    control.start({
      serverName: 'example',
      port: 4000,
      root: process.cwd(),
      logDir: 'logs/',
      directoryIndex: true
    });
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
