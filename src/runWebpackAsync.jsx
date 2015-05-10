const getFinalWebpackConfigAsync =
  require('./getModifiedWebpackConfigAsync.jsx');
const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const webpackAsync = Bluebird.promisify(require('webpack'));

/**
 * Imports `cjbConfig.js/jsx`, manipulates the `webpackConfig` according to
 * the configuration's exported property `target`, and runs webpack with that
 * webpack configuration.
 *
 * @async
 * @returns {void}
 * @throws {Error} When the webpack configuration for a certain cjbConfig
 * `target` has not been implemented.
 */
async function runWebpackAsync() {
  try {

    const webpackConfig = await getFinalWebpackConfigAsync();

    const stats = await webpackAsync(webpackConfig);

    console.log(stats.toString({
      cached: false,
      cachedAssets: false,
      colors: true
    }));

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runWebpackAsync;
