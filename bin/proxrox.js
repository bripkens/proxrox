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
  .option('--ssi', 'Enable server-side includes', false)
  .option('--tls', 'Enable transport layer security', false)
  .option('--spdy', 'Support the SPDY protocol (implies --tls)', false)
  .action(function(cmd) {
    var config = {
      serverName: 'example',
      port: cmd.port,
      root: process.cwd(),
      logDir: 'logs/',
      directoryIndex: true,
      gzip: cmd.compression,
      proxy: cmd.proxy || null,
      tls: cmd.tls || cmd.spdy,
      spdy: cmd.spdy,
      ssi: cmd.ssi
    };
    var result = control.start(config);

    var scheme = config.tls ? 'https' : 'http';
    var uri = scheme + '://localhost:' + config.port;
    console.log('Server successfully started'.underline.green);
    console.log('URI:                             %s', uri);
    console.log('Nginx config and log location:   %s', result.path);
  });

program
  .command('stop')
  .description('Stop all running nginx instances')
  .action(function() {
    if (!control.stop()) {
      console.error('Failed to stop Nginx'.red);
      process.exit(1);
    }
  });

program.parse(process.argv);
if (program.args.length === 0) {
  // this automatically quits the program
  program.help();
} else if (typeof program.args[0] === 'string') {
  console.error(('Unknown command ' + program.args[0]).red);
  process.exit(1);
}
