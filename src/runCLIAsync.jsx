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
 * Given a `webpackConfig` as follows:
 *
 * ```JS
 * {
 *   output: {libraryTarget: 'something'},
 *   target: 'node'
 * }
 * ```
 *
 * returns the following string:
 *
 * ```
 * // Begin: CJB-generated code
 * require('chcokr-js-build/dist/polyfill-something');
 * // End: CJB-generated code
 * ```
 *
 * @param {object} webpackConfig The webpack configuration object of an entry
 * file (as would be defined inside cjbConfig.js/jsx).
 * @returns {string} The text to add to the top of the temporary entry file.
 */
function getTextToAddToTopOfTempEntryFile(webpackConfig) {
  return webpackConfig.output.libraryTarget ? '' :
    '// Begin: CJB-generated code\n' +
      `require('chcokr-js-build/dist/polyfill-${webpackConfig.target}');` +
      '\n' +
      '// End: CJB-generated code\n';
}

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
 *  - otherwise, creates the webpack bundles for each entry point in dist/.
 *  Note that the following text gets added to the top of a temporary copy of
 *  the entry file.
 *  This temporary file will be used as the entry point when webpack is invoked.
 *
 *   - If the entry point's `output.libraryTarget` is defined, nothing
 *   significant will be added.
 *   - Assume `output.libraryTarget` is undefined from here on.
 *   - If `target` is `"node"`, the following is added.
 *   ```JS
 *   require('chcokr-js-build/dist/polyfill-node');
 *   ```
 *   - If `target` is `"web"`, the following is added.
 *   ```JS
 *   require('chcokr-js-build/dist/polyfill-web');
 *   ```
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

      await runWebpackDevServerAsync(
        config,
        getTextToAddToTopOfTempEntryFile(config)
      );
    } else {
      const entryPointNames = Object.keys(webpackConfigs);
      for (let pointName of entryPointNames) {
        const config = webpackConfigs[pointName];
        await runWebpackAsync(
          config,
          getTextToAddToTopOfTempEntryFile(config)
        );
      }
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runCLIAsync;
