const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const ESLintCLIEngine = require('eslint').CLIEngine;
const globAsync = Bluebird.promisify(require('glob'));
const path = require('path');

const cwd = process.cwd();

/**
 * Prints to `stderr` the error message objects returned by ESLintCLIEngine's
 * executeOnFiles() method (check its API) in the following format:
 *
 * ```
 * <two spaces>[1:20] x is defined but never used (no-unused-vars)
 * ```
 *
 * @param {Array<Object>} objs The error message objects returned by
 * ESLintCLIEngine's executeOnFiles() method.
 * @returns {void}
 */
function printEslintErrorMsgObjs(objs) {
  for (let m of objs) {
    console.error(`  [${m.line}:${m.column}] ${m.message} (${m.ruleId})`);
  }
}

/**
 * Runs ESLint on th following files, and prints the results.
 * If at least one error or one warning has been found, an Error will be thrown.
 *
 * - Either `cjbConfig.js` or `cjbConfig.jsx`
 * - Either `environment.js` or `environment.jsx`
 * - Files with the extension `.js` or `.jsx` in src/
 * - Files with the extension `.js` or `.jsx` in __tests__/
 *
 * @returns {void}
 * @throws {Error} When ESLint has detected at least one error or one warning
 * in the aforementioned files.
 */
async function runEslintAsync() {
  const cjbConfigJsExists =
    await utils.pathExistsAsync(path.resolve(cwd, 'cjbConfig.js'));
  const environmentJsExists =
    await utils.pathExistsAsync(path.resolve(cwd, 'environment.js'));

  const cjbConfigPath =
    path.resolve(cwd, 'cjbConfig.' + (cjbConfigJsExists ? 'js' : 'jsx'));
  const envFilePath =
    path.resolve(cwd, 'environment.' + (environmentJsExists ? 'js' : 'jsx'));
  const filePathsInSrc = await globAsync('src/*.{js,jsx}');
  const filePathsInTests = await globAsync('__tests__/*.{js,jsx}');

  const filePathsToLint = [
    cjbConfigPath,
    envFilePath,
    ...filePathsInSrc,
    ...filePathsInTests
  ];

  console.log('ESLint: linting');

  const eslintResult = new ESLintCLIEngine({
    baseConfig: require('./.eslintrc'),
    useEslintrc: false
  }).executeOnFiles(filePathsToLint);

  if (eslintResult.errorCount === 0 && eslintResult.warningCount === 0) {

    console.info('ESLint: no errors');

  } else {

    for (let fileResult of eslintResult.results) {
      if (fileResult.errorCount > 0 || fileResult.warningCount > 0) {
        console.error(`ESLint: in file ${fileResult.filePath}`);
        printEslintErrorMsgObjs(fileResult.messages);
      }
    }

    throw new Error('ESLint: aborting due to errors');

  }
}

module.exports = runEslintAsync;
