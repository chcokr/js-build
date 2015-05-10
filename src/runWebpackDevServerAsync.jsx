const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
const getModifiedWebpackConfigAsync =
  require('./getModifiedWebpackConfigAsync.jsx');
const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Makes the following modifications to the default-manipulated `cjbConfig`
 * object, and runs the webpack-dev-server using that new configuration on the
 * port specified in `cjbConfig.js/jsx`'s exported property `wdsPort`.
 *
 * ### `entry`
 *
 * The following strings are added to the **beginning** of the `entry` array.
 *
 * ```
 * webpack-dev-server/client?http://0.0.0.0:<wdsPort in cjbConfig.js/jsx>
 * ```
 *
 * ```
 * webpack/hot/dev-server
 * ```
 * ### `output.publicPath`
 *
 * `output.publicPath` is set to `dist/`.
 *
 * @returns {void}
 * @throws {Error} When cjbConfig.js/jsx doesn't export property `wdsPort`
 * @throws {Error} When `wdsPort` isn't an integer
 */
async function runWebpackDevServerAsync() {
  try {

    const cjbConfig = await getCjbConfigAsync();

    if (!cjbConfig.wdsPort) {
      throw new Error('To use the webpack dev server, cjbConfig.js/jsx must' +
        ' export property `wdsPort`');
    }

    if (!Number.isInteger(cjbConfig.wdsPort)) {
      throw new Error('Property `wdsPort` in cjbConfig.js/jsx must be an' +
        ' integer`');
    }

    const port = cjbConfig.wdsPort;

    const webpackConfig = await getModifiedWebpackConfigAsync();

    let devServerWebpackConfig = Object.assign({}, webpackConfig);

    if (!devServerWebpackConfig.entry) {
      devServerWebpackConfig.entry = [];
    }
    devServerWebpackConfig.entry = [
      `webpack-dev-server/client?http://0.0.0.0:${port}`,
      'webpack/hot/dev-server',
      ...devServerWebpackConfig.entry
    ];

    if (!devServerWebpackConfig.output) {
      devServerWebpackConfig.output = {};
    }
    devServerWebpackConfig.output.publicPath = '/dist';

    const server = Bluebird.promisifyAll(new WebpackDevServer(
      webpack(webpackConfig),
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
