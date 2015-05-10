const createWebpackConfigNodeTarget =
  require('./createWebpackConfigNodeTarget.jsx');
const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Imports `cjbConfig.js/jsx`, manipulates the `webpackConfig` according to
 * the configuration's exported property `target`, and returns the final
 * modified version for direct use with webpack.
 *
 * @async
 * @returns {object} The final modified version of the `webpackConfig`.
 * @throws {Error} When the webpack configuration for a certain cjbConfig
 * `target` has not been implemented.
 */
async function getModifiedWebpackConfigAsync() {
  try {

    const cjbConfig = await getCjbConfigAsync();

    const cjbTarget = cjbConfig.target;
    const cjbWebpackConfig = cjbConfig.webpackConfig;

    switch (cjbTarget) {
      case 'node':
        return createWebpackConfigNodeTarget(cjbWebpackConfig);
      default:
        throw new Error(`webpack configuration for target "${cjbTarget}"` +
          ` has not been implemented`);
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = getModifiedWebpackConfigAsync;
