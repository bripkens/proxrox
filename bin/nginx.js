#!/usr/bin/env node

'use strict';

var program = require('commander');

var install = require('../lib/install');

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
  });

program
  .command('stop')
  .description('Stop nginx')
  .action(function() {
    console.log('Stopping...');
  });

program.parse(process.argv);
