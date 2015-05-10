const utils = require('./utils.jsx');

const path = require('path');

const cwd = process.cwd();
const pathExistsAsync = utils.pathExistsAsync;

/**
 * Checks whether all of the following paths exist, and throws an Error as soon
 * as one of them is not found.
 *
 * - Either cjbConfig.js or cjbConfig.jsx
 * - Either environment.js or environment.jsx
 * - .git/
 * - dist/
 * - src/
 * - __tests__/
 *
 * @async
 * @returns {void}
 * @throws {Error}
 */
async function checkPathsExistAsync() {
  console.log('Checking if cjbConfig.{js,jsx} exists');
  const cjbConfigJsExists =
    await pathExistsAsync(path.resolve(cwd, 'cjbConfig.js'));
  const cjbConfigJsxExists =
    await pathExistsAsync(path.resolve(cwd, 'cjbConfig.jsx'));
  if (!cjbConfigJsExists && !cjbConfigJsxExists) {
    throw new Error('Project root must have a file named cjbConfig.js or' +
      ' cjbConfig.jsx');
  }

  console.log('Checking if environment.{js,jsx} exists');
  const environmentJsExists =
    await pathExistsAsync(path.resolve(cwd, 'environment.js'));
  const environmentJsxExists =
    await pathExistsAsync(path.resolve(cwd, 'environment.jsx'));
  if (!environmentJsExists && !environmentJsxExists) {
    throw new Error('Project root must have a file named environment.js or' +
      ' environment.jsx');
  }

  console.log('Checking if README.md exists');
  const readmeExists = await pathExistsAsync(path.resolve(cwd, 'README.md'));
  if (!readmeExists) {
    throw new Error('Project root must have a file named README.md');
  }

  console.log('Checking if .git/ exists');
  const gitExists = await pathExistsAsync(path.resolve(cwd, '.git'));
  if (!gitExists) {
    throw new Error('Project root must have a directory named .git/');
  }

  console.log('Checking if dist/ exists');
  const distExists = await pathExistsAsync(path.resolve(cwd, 'dist'));
  if (!distExists) {
    throw new Error('Project root must have a directory named dist/');
  }

  console.log('Checking if src/ exists');
  const srcExists = await pathExistsAsync(path.resolve(cwd, 'src'));
  if (!srcExists) {
    throw new Error('Project root must have a directory named src/');
  }

  console.log('Checking if __tests__/ exists');
  const testsExists = await pathExistsAsync(path.resolve(cwd, '__tests__'));
  if (!testsExists) {
    throw new Error('Project root must have a directory named __tests__/');
  }
}

module.exports = checkPathsExistAsync;
