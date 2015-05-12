const checkPathsExistAsync = require('./checkPathsExistAsync.jsx');
const getModifiedWebpackConfigsAsync =
  require('./getModifiedWebpackConfigsAsync.jsx');
const installPrecommitHookAsync = require('./installPrecommitHookAsync.jsx');
const runBabelAsync = require('./runBabelAsync.jsx');
const runEslintAsync = require('./runEslintAsync.jsx');
const runWebpackDevServerAsync = require('./runWebpackDevServerAsync.jsx');
const runWebpackAsync = require('./runWebpackAsync.jsx');
const utils = require('./utils.jsx');

/**
 * Runs the following tasks in order:
 *
 * - Check if certain paths exist
 * - Install the Git pre-commit hook
 * - Try babel compilation
 * - Run ESLint
 * - Webpack:
 *  - if `process.argv[2]` is `wds`, runs the webpack-dev-server with entry
 *  point set to `process.argv[3]`
 *  - otherwise, creates the webpack bundles for each entry point in dist/
 *
 * @returns {void}
 */
async function runCLIAsync() {
  try {

    await checkPathsExistAsync();

    await installPrecommitHookAsync();

    await runBabelAsync();

    await runEslintAsync();

    const webpackConfigs = await getModifiedWebpackConfigsAsync();
    if (process.argv[2] === 'wds') {
      const entryPointName = process.argv[3];
      const config = webpackConfigs[entryPointName];
      await runWebpackDevServerAsync(config);
    } else {
      await runWebpackAsync(webpackConfigs);
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runCLIAsync;
