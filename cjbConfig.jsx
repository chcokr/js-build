const webpack = require('webpack');

module.exports.target = 'node';

module.exports.webpackConfigs = {
  api: {
    entry: './src/api.jsx',
    module: {
      loaders: [
        {test: /\.(eslintrc|babelrc)$/, loader: 'json'}
      ]
    },
    output: {
      filename: 'api.js',
      libraryTarget: 'commonjs2'
    }
  },
  bin: {
    entry: './src/bin.jsx',
    module: {
      loaders: [
        {test: /\.(eslintrc|babelrc)$/, loader: 'json'}
      ]
    },
    output: {
      filename: 'bin.js',
      module
    },
    plugins: [
      new webpack.BannerPlugin(
        '#!/usr/bin/env node',
        {raw: true, entryOnly: false}
      )
    ]
  }
};
