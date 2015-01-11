#!/usr/bin/env node

'use strict';

require('colors');
var commander = require('commander');

var install = require('../lib/install');
var control = require('../lib/control');

var program = new commander.Command();

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
  .option('--proxy <uri>', 'An IP to proxy via nginx')
  .option('-p --port [port]', 'The port to bind to.', 4000)
  .option('--no-compression', 'Disable GZIP compression', false)
  .action(function(cmd) {
    var port = cmd.port;
    var config = {
      serverName: 'example',
      port: port,
      root: process.cwd(),
      logDir: 'logs/',
      directoryIndex: true,
      gzip: cmd.compression,
      proxy: cmd.proxy || null
    };
    var result = control.start(config);

    console.log('Server successfully started'.underline.green);
    console.log('URI:                             http://localhost:%d', port);
    console.log('Nginx config and log location:   %s', result.path);
    console.log('Process ID:                      %d', result.pid);
  });

program
  .command('stop')
  .description('Stop all running nginx instances')
  .action(function() {
    if (!control.stop()) {
      console.error('Failed to stop Nginx');
    }
  });

program.parse(process.argv);
if (program.args.length === 0) {
  // this automatically quits the program
  program.help();
} else if (typeof program.args[0] === 'string') {
  console.error(('Unknown command ' + program.args[0]).red);
}
