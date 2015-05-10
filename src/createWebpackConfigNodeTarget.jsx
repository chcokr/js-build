// inspired by http://jlongster.com/Backend-Apps-with-Webpack--Part-I (thanks)

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
 * (**NOTE**: this function should be used when `cjbConfig.js/jsx` exports a
 * property `target` of value `"node"`).
 *
 * ### `devtool`
 *
 * In node mode, `devtool` is set to `"sourcemap"`.
 *
 * ### `externals`
 *
 * In node mode, `externals` is set to:
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
 * In node mode, the following loaders are added at the **end** of the
 * `module.loaders` array (order: the last one in this list will be the last one
 * in the `module.loaders` array).
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
 * In node mode, the following plugins are added at the **beginning** of the
 * `plugins` array, in this order:
 *
 * ```JS
 * new webpack.BannerPlugin(
 * `require('babel/polyfill');`,
 * {raw: true, entryOnly: false}
 * )
 * ```
 * ```JS
 * new webpack.BannerPlugin(
 * `require('source-map-support').install();`,
 * {raw: true, entryOnly: false}
 * )
 * ```
 *
 * ### `target`
 *
 * In node mode, `target` is set to `"node"`.
 *
 * @param {webpackConfig} config The `webpackConfig` property of a
 * `cjbConfig.js/jsx`
 * @returns {object} A new config object which all properties of `config`
 * have been copied into and the aforementioned modifications have been made to.
 */
function createWebpackConfigNodeTarget(config) {
  const newConfig = Object.assign({}, config);

  newConfig.devtool = 'sourcemap';

  newConfig.externals = nodeModules;

  if (!newConfig.module) {
    newConfig.module = {};
  }
  if (!newConfig.module.loaders) {
    newConfig.module.loaders = [];
  }
  newConfig.module.loaders = [
    ...newConfig.module.loaders,
    {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel'},
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
    new webpack.BannerPlugin(
      `require('babel/polyfill');`,
      {raw: true, entryOnly: false}
    ),
    new webpack.BannerPlugin(
      `require('source-map-support').install();`,
      {raw: true, entryOnly: false}
    ),
    ...newConfig.plugins
  ];

  newConfig.target = 'node';

  return newConfig;
}

module.exports = createWebpackConfigNodeTarget;
