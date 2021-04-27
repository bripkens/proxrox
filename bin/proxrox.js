#!/usr/bin/env node
/* eslint-disable complexity */

'use strict';

require('colors');
var defaults = require('lodash/defaults');
var commander = require('commander');
var path = require('path');

var configLoader = require('../lib/config_loader');
var install = require('../lib/install');
var control = require('../lib/control');
var util = require('../lib/util');

var program = new commander.Command();
var executedCommands = [];

program
  .version(require('../package.json').version);

program
  .command('install')
  .description('Install nginx')
  .action(trackExecutedCommand(function() {
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
  }));

program
  .command('start [config]')
  .description('Serve contents of the current directory via nginx')
  .option('--proxy <uri>', 'An IP to proxy via nginx')
  .option('-p --port [port]', 'The port to bind to.', 4000)
  .option('--no-compression', 'Disable GZIP compression', false)
  .option('--stub-status', 'Enable stub_status module', false)
  .option('--ssi', 'Enable server-side includes', false)
  .option('--tls', 'Enable transport layer security', false)
  .option('--spdy', 'Support the SPDY protocol (implies --tls)', false)
  .option('--no-standard-server', 'Whether or not the default server section should be generated', false)
  .option('--extra-site <nginx config file path>', 'Additional nginx config to embed in the HTTP section')
  .action(trackExecutedCommand(function(configLocation, options) {
    // this happens when the command is called without an argument
    if (arguments.length === 1) {
      options = configLocation;
      configLocation = null;
    }

    var config = {
      serverName: 'example',
      port: options.port,
      root: process.cwd(),
      logDir: 'logs/',
      directoryIndex: true,
      gzip: options.compression,
      proxy: options.proxy || null,
      tls: options.tls,
      spdy: options.spdy,
      ssi: options.ssi,
      stubStatus: options.stubStatus,
      standardServer: options.standardServer,
      extraSite: options.extraSite,
      proxyReadTimeout: options.proxyReadTimeout,
    };

    // now config properties take precedence over the CLI arguments.
    // This is fine for now, but people may require the opposite in the
    // future. Should this happen, then we would need to exchange
    // commander.js for some CLI parser that allows one to check whether
    // a CLI arg is set.
    if (configLocation) {
      var loadedConfig = configLoader.loadConfig(configLocation);
      // relative root paths should be supported. Resolve the root against
      // the config location
      if (loadedConfig.root && util.isRelative(loadedConfig.root)) {
        var root = path.resolve(
          path.dirname(configLocation),
          loadedConfig.root
        );
        loadedConfig.root = root;
      }
      config = defaults(loadedConfig, config);
    }

    var result = control.start(config);

    console.log('Server successfully started'.underline.green);
    if (config.standardServer) {
      var scheme = config.tls ? 'https' : 'http';
      var uri = scheme + '://localhost:' + config.port;
      console.log('URI:                             %s', uri);
    }
    console.log('Nginx config and log location:   %s', result.path);
  }));

program
  .command('stop')
  .description('Stop all running nginx instances')
  .action(trackExecutedCommand(function() {
    control.stop();
  }));

program.parse(process.argv);
if (executedCommands.length === 0) {
  // this automatically quits the program
  program.help();
}

function trackExecutedCommand(fn) {
  return function(args, options) {
    if (arguments.length === 1) {
      options = args;
    }
    executedCommands.push(options._name);
    return fn.apply(this, arguments);
  };
}
