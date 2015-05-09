const path = require('path');
const webpack = require('webpack');

module.exports.target = 'node';

module.exports.webpackConfig = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: [
    new webpack.BannerPlugin(
      '#!/usr/bin/env node',
      {raw: true, entryOnly: false}
    )
  ],
  module: {
    loaders: [
      {test: /\.(eslintrc|babelrc)$/, loader: 'json'}
    ]
  }
};
