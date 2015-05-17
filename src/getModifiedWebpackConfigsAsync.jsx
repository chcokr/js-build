const createSingleWebpackConfig = require('./createSingleWebpackConfig.jsx');
const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Imports `cjbConfig.js/jsx`, manipulates each entry point of `webpackConfigs`
 * according to its property `target`, and returns the final modified version
 * of `webpackConfigs`, for direct use with webpack.
 *
 * @async
 * @returns {object} The final modified version of the `webpackConfig`.
 */
async function getModifiedWebpackConfigsAsync() {
  try {

    const cjbConfig = await getCjbConfigAsync();

    const cjbWebpackConfigs = cjbConfig.webpackConfigs;

    const entryPoints = Object.keys(cjbWebpackConfigs);

    const newConfigs = {};
    for (let point of entryPoints) {
      newConfigs[point] =
        createSingleWebpackConfig(cjbWebpackConfigs[point]);
    }

    return newConfigs;

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = getModifiedWebpackConfigsAsync;
