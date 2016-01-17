'use strict';

var webpack = require('webpack');


module.exports = function webpackConfigGenerator(compilationMode) {
  var definePlugin = new webpack.DefinePlugin({
    // This is necessary for the React and other modules which rely on the
    // existence of this environment variable.
    'process.env.NODE_ENV': compilationMode === 'dev' ?
      '"development"' : '"production"'
  });

  return {
    entry: './client/index.js',
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    plugins: [
      definePlugin
    ]
  };
};
