const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const webpackAsync = Bluebird.promisify(require('webpack'));

/**
 * Runs webpack with the given configurations `webpackConfigs` without making
 * any modifications to the configuration.
 *
 * @async
 * @param {object} webpackConfigs The webpackConfigs which will *NOT* be
 * modified and will be directly used to run webpack
 * @returns {void}
 */
async function runWebpackAsync(webpackConfigs) {
  try {

    const entryPoints = Object.keys(webpackConfigs);

    for (let point of entryPoints) {
      const configForThisEntryPoint = webpackConfigs[point];

      const stats = await webpackAsync(configForThisEntryPoint);

      console.log(stats.toString({
        cached: false,
        cachedAssets: false,
        colors: true
      }));
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runWebpackAsync;
