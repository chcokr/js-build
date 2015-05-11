const webpack = require('webpack');

module.exports.target = 'node';

module.exports.webpackConfig = {
  entry: {
    api: './src/api.jsx',
    bin: './src/bin.jsx'
  },
  output: {
    filename: '[name].js'
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
