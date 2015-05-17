const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();

const nodeModules =
  fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .reduce((prev, mod) => {
      prev[mod] = `commonjs ${mod}`;
      return prev;
    }, {});

/**
 * Creates a separate copy of the given `webpackConfig` object, makes the
 * following modifications to the object, and returns it.
 *
 * Thanks [James Long](http://jlongster.com/Backend-Apps-with-Webpack--Part-I)
 * for the inspiration!
 *
 * ### `devtool`
 *
 * If `config.target` is `"web"`, `devtool` is not touched.
 *
 * If `config.target` is `"node"`, `devtool` is set to `"sourcemap"`.
 *
 * ### `externals`
 *
 * If `config.target` is `"web"`, `externals` is not touched.
 *
 * If `config.target` is `"node"`, `externals` is set to:
 *
 * ```JS
 * const nodeModules =
 * fs.readdirSync('node_modules')
 * .filter(x => ['.bin'].indexOf(x) === -1)
 * .reduce((prev, mod) => {
 *      prev[mod] = `commonjs ${mod}`;
 *      return prev;
 *    }, {});
 * ```
 *
 * ### `module.loaders`
 *
 * The following loaders are added at the **end** of the `module.loaders` array
 * (order: the last one in this list will be the last one in the
 * `module.loaders` array).
 *
 * ```JS
 * {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel'}
 * ```
 * ```JS
 * {test: /\.json$/, loader: 'json'}
 * ```
 *
 * ### `output.path`
 *
 * `output.path` is set to the absolute path of the `dist/` directory.
 *
 * ### `plugins`
 *
 * The following plugins are added at the **beginning** of the `plugins` array,
 * in this order:
 *
 * ```
 * // Adding this plugin even when hot-loading is not used doesn't seem to hurt.
 * new webpack.HotModuleReplacementPlugin()
 * ```
 * ```
 * new webpack.NoErrorsPlugin()
 * ```
 *
 * @param {object} config A single entry point's webpack configuration
 * @returns {object} A new config object which all properties of `config`
 * have been copied into and the aforementioned modifications have been made to.
 */
function createSingleWebpackConfig(config) {
  const newConfig = Object.assign({}, config);

  if (config.target === 'node') {
    newConfig.devtool = 'sourcemap';
  }

  if (config.target === 'node') {
    newConfig.externals = nodeModules;
  }

  if (!newConfig.module) {
    newConfig.module = {};
  }
  if (!newConfig.module.loaders) {
    newConfig.module.loaders = [];
  }
  newConfig.module.loaders = [
    ...newConfig.module.loaders,
    {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel?' + JSON.stringify(require('./.babelrc'))
    },
    {test: /\.json$/, loader: 'json'}
  ];

  if (!newConfig.output) {
    newConfig.output = {};
  }

  newConfig.output.path = path.resolve(cwd, 'dist');

  if (!newConfig.plugins) {
    newConfig.plugins = [];
  }
  newConfig.plugins = [
    // Adding this plugin even when hot-loading is not used doesn't seem to
    // hurt.
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoErrorsPlugin(),
    ...newConfig.plugins
  ];

  return newConfig;
}

module.exports = createSingleWebpackConfig;
