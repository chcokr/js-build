const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const webpackAsync = Bluebird.promisify(require('webpack'));

/**
 * Runs webpack with the given configuration `webpackConfig` without making any
 * modifications to the configuration.
 *
 * @async
 * @param {object} webpackConfig The webpackConfig which will *NOT* be modified
 * and will be directly used to run webpack
 * @returns {void}
 */
async function runWebpackAsync(webpackConfig) {
  try {

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
