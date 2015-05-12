const createSingleWebpackConfig = require('./createSingleWebpackConfig.jsx');
const getCjbConfigAsync = require('./getCjbConfigAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Imports `cjbConfig.js/jsx`, manipulates the `webpackConfigs` according to
 * the configuration's exported property `target`, and returns the final
 * modified version for each entry point, for direct use with webpack.
 *
 * @async
 * @returns {object} The final modified version of the `webpackConfig`.
 */
async function getModifiedWebpackConfigsAsync() {
  try {

    const cjbConfig = await getCjbConfigAsync();

    const cjbTarget = cjbConfig.target;
    const cjbWebpackConfigs = cjbConfig.webpackConfigs;

    const entryPoints = Object.keys(cjbWebpackConfigs);

    const newConfigs = {};
    for (let point of entryPoints) {
      newConfigs[point] =
        createSingleWebpackConfig(cjbTarget, cjbWebpackConfigs[point]);
    }

    return newConfigs;

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = getModifiedWebpackConfigsAsync;
