const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const babel = Bluebird.promisifyAll(require('babel'));
const globAsync = Bluebird.promisify(require('glob'));
const path = require('path');

const cwd = process.cwd();

/**
 * Runs Babel on the following files, but doesn't store the compilation results
 * anywhere.
 * If at least one error or one warning has been found, an Error will be thrown.
 *
 * - Either `cjbConfig.js` or `cjbConfig.jsx`
 * - Either `environment.js` or `environment.jsx`
 * - Files with the extension `.js` or `.jsx` in src/
 * - Files with the extension `.js` or `.jsx` in __tests__/
 *
 * @returns {void}
 * @throws {Error} When Babel has detected at least one error or one warning
 * in the aforementioned files.
 */
async function runBabelAsync() {
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

  const filePathsToCompile = [
    cjbConfigPath,
    envFilePath,
    ...filePathsInSrc,
    ...filePathsInTests
  ];

  const babelOptions = require('./.babelrc');

  console.log('Babel: compiling');

  for (let filePath of filePathsToCompile) {
    try {
      babel.transformFileAsync(filePath, babelOptions);
    } catch (err) {
      console.error(`Babel: in file ${filePath}`);
      throw err;
    }
  }

  console.log('Babel: no errors');
}

module.exports = runBabelAsync;
