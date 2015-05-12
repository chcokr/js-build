const checkPathsExistAsync = require('./checkPathsExistAsync.jsx');
const getModifiedWebpackConfigAsync =
  require('./getModifiedWebpackConfigAsync.jsx');
const installPrecommitHookAsync = require('./installPrecommitHookAsync.jsx');
const runBabelAsync = require('./runBabelAsync.jsx');
const runEslintAsync = require('./runEslintAsync.jsx');
const runWebpackAsync = require('./runWebpackAsync.jsx');
const runWebpackDevServerAsync = require('./runWebpackDevServerAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Runs the following tasks in order:
 *
 * - Check if certain paths exist
 * - Install the Git pre-commit hook
 * - Try babel compilation
 * - Run ESLint
 * - Webpack:
 *  - if `mode` is `wds`, runs the webpack-dev-server
 *  - otherwise, creates the webpack bundle in dist/
 *
 * @param {string} mode Either "wds" or `undefined`.
 * @returns {void}
 */
async function runAsync(mode) {
  try {

    await checkPathsExistAsync();

    await installPrecommitHookAsync();

    await runBabelAsync();

    await runEslintAsync();

    const webpackConfig = await getModifiedWebpackConfigAsync();
    if (mode === 'wds') {
      await runWebpackDevServerAsync(webpackConfig);
    } else {
      await runWebpackAsync(webpackConfig);
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runAsync;
