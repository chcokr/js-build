const createWebpackConfigNodeTarget =
  require('./createWebpackConfigNodeTarget.jsx');
const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
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

    const cjbConfig = await getCjbConfigAsync();

    const cjbTarget = cjbConfig.target;
    const cjbWebpackConfig = cjbConfig.webpackConfig;

    const webpackConfig = (() => {
      switch (cjbTarget) {
        case 'node':
          return createWebpackConfigNodeTarget(cjbWebpackConfig);
        default:
          throw new Error(`webpack configuration for target "${cjbTarget}"` +
            ` has not been implemented`);
      }
    })();

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
