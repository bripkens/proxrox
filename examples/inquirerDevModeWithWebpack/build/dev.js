'use strict';

var execSync = require('child_process').execSync;
var fs = require('fs');
var inquirer = require('inquirer');
var opn = require('opn');
var os = require('os');
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var webpackConfigGenerator = require('./webpackConfigGenerator.js');
var questions = require('./questions');

inquirer.prompt(questions, function (answers) {
  openDevUrl();
  startProxrox(answers.environment);
  startWebpackDevServer(answers.compilationMode);
});

function startWebpackDevServer(compilationMode) {
  var config = webpackConfigGenerator(compilationMode);

  new WebpackDevServer(webpack(config), {
    stats: {
      colors: true,
    },
  }).listen(3000, 'localhost', function (err) {
    if (err) {
      throw new Error('Failed to start Webpack dev server', err);
    }
    console.log('Webpack dev server listening at http://localhost:3000/');
  });
}

function startProxrox(backendUrl) {
  startProxroxWithConfig({
    tls: true,
    root: path.join(__dirname, '..', 'client'),
    proxy: [
      {
        type: 'http',
        from: '/',
        to: 'http://localhost:3000',
      },
      {
        type: 'http',
        from: '/api/',
        to: backendUrl,
      },
    ],
  });
}

function startProxroxWithConfig(config) {
  var configLocation = path.join(os.tmpdir(), '.proxrox.json');
  fs.writeFileSync(configLocation, JSON.stringify(config, 0, 2));

  var executable = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    'proxrox'
  );
  execSync('"' + executable + '" stop', {
    stdio: 'inherit',
  });
  execSync('"' + executable + '" start "' + configLocation + '"', {
    stdio: 'inherit',
  });
}

function openDevUrl() {
  opn('https://localhost:4000');
}
