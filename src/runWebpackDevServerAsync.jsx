const getProjectEnvAsync = require('./getProjectEnvAsync.jsx');
const generateModifiedEntryFileAsync =
  require('./generateModifiedEntryFileAsync.jsx');
const utils = require('./utils.jsx');

const _ = require('lodash');
const Bluebird = require('bluebird');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Generates a temporary copy of the entry file defined in `webpackConfig`'s
 * property `entry` using `generateModifiedEntryFileAsync()`, sets the `entry`
 * to the absolute path of the temporary file, makes the following further
 * modifications to the configuration, and runs webpack-dev-server with that
 * final configuration, on the port specified in `environment.js/jsx`'s exported
 * property `CJB_WDS_PORT`.
 *
 * ### `entry`
 *
 * `entry` is set to the following:
 *
 * ```
 * [
 *   'webpack-dev-server/client?' +
 *     'http://0.0.0.0:<CJB_WDS_PORT in environment.js/jsx>',
 *   'webpack/hot/dev-server',
 *   '<absolute path of the temporary entry file>'
 * ]
 * ```
 *
 * ### `output.publicPath`
 *
 * `output.publicPath` is set to `dist/`.
 *
 * @param {object} webpackConfig The webpackConfig which will be modified and
 * then be used to run webpack-dev-server
 * @returns {void}
 * @throws {Error} When environment.js/jsx doesn't export property
 * `CJB_WDS_PORT`
 * @throws {Error} When `CJB_WDS_PORT` isn't an integer
 */
async function runWebpackDevServerAsync(webpackConfig) {
  try {
    if (!_.isString(webpackConfig.entry)) {
      throw new Error('`webpackConfig.entry` must be a string');
    }

    const projectEnv = await getProjectEnvAsync();

    const port = projectEnv.CJB_WDS_PORT;

    if (!port) {
      throw new Error('To use the webpack dev server, environment.js/jsx must' +
        ' export property `CJB_WDS_PORT`');
    }

    if (!Number.isInteger(port)) {
      throw new Error('Property `wdsPort` in projectEnv.js/jsx must be an' +
        ' integer`');
    }

    let devServerWebpackConfig = Object.assign({}, webpackConfig);

    const newEntryFilePath =
      await generateModifiedEntryFileAsync(devServerWebpackConfig);

    devServerWebpackConfig.entry = [
      `webpack-dev-server/client?http://0.0.0.0:${port}`,
      'webpack/hot/dev-server',
      newEntryFilePath
    ];

    if (!devServerWebpackConfig.output) {
      devServerWebpackConfig.output = {};
    }
    devServerWebpackConfig.output.publicPath = '/dist';

    const server = Bluebird.promisifyAll(new WebpackDevServer(
      webpack(devServerWebpackConfig),
      {
        publicPath: devServerWebpackConfig.output.publicPath,
        hot: true
      }
    ));

    // Setting the host to "localhost" instead of "0.0.0.0" makes the server
    // inaccessible from a guest OS on virtual machines.
    await server.listenAsync(port, '0.0.0.0');

    console.log(`Webpack dev server listening at 0.0.0.0:${port}`);

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runWebpackDevServerAsync;
