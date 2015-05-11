const createWebpackConfigNodeTarget = require('./createWebpackConfig.jsx');
const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Imports `cjbConfig.js/jsx`, manipulates the `webpackConfig` according to
 * the configuration's exported property `target`, and returns the final
 * modified version for direct use with webpack.
 *
 * @async
 * @returns {object} The final modified version of the `webpackConfig`.
 */
async function getModifiedWebpackConfigAsync() {
  try {

    const cjbConfig = await getCjbConfigAsync();

    const cjbTarget = cjbConfig.target;
    const cjbWebpackConfig = cjbConfig.webpackConfig;

    return createWebpackConfigNodeTarget(cjbTarget, cjbWebpackConfig);

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = getModifiedWebpackConfigAsync;
