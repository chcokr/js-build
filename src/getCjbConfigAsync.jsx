const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const babel = Bluebird.promisifyAll(require('babel'));
const fs = Bluebird.promisifyAll(require('fs'));
/* eslint-disable no-underscore-dangle */
const nodeRequire = require('module')._load;
/* eslint-enaable no-underscore-dangle */
const path = require('path');

const cwd = process.cwd();

let cjbConfigCache = null;

/**
 * Reads in the content of `cjbConfig.js/jsx`, compiles it with babel, and
 * return the object which the file exports.
 * Since this function invovles a bit of I/O, there should be a caching layer
 * on top of this function.
 * For a function that takes care of caching as well, use
 * `getCjbConfigAsync` instead.
 *
 * @async
 * @returns {object} An object obtained from `cjbConfig.js/jsx`.
 * @throws {Error} When Babel cannot compile the contents of `cjbConfig.js/jsx`.
 */
async function readCjbConfigAsync() {
  try {

    const cjbConfigJsExists =
      await utils.pathExistsAsync(path.resolve(cwd, 'cjbConfig.js'));
    const cjbConfigPath = path.join(
      cwd,
      'cjbConfig.' + (cjbConfigJsExists ? 'js' : 'jsx')
    );

    // cjbConfig.js/jsx may be written in non-node-compatible JS.
    // So we transpile the file,
    // write the result of the transpilation in a temporary file,
    // extract the `module.exports` object using node's native
    // `require` function (which is accessible by `require('module')._load`),
    // and then remove the temporary file.

    const babelOptions = require('./.babelrc');

    let transpiledCjbConfigContent;
    try {
      transpiledCjbConfigContent =
        (await babel.transformFileAsync(cjbConfigPath, babelOptions)).code;
    } catch (err) {
      console.error(`Babel: in file ${cjbConfigPath}`);
      throw err;
    }

    const transpiledCjbConfigFileName = 'cjbConfig.transpiled.js';

    await fs.writeFileAsync(
      transpiledCjbConfigFileName,
      transpiledCjbConfigContent
    );

    const transpiledCjbConfigPath = path.join(cwd, transpiledCjbConfigFileName);

    const cjbConfig = nodeRequire(transpiledCjbConfigPath);

    await fs.unlinkAsync(transpiledCjbConfigPath);

    return cjbConfig;

  } catch (err) {
    utils.handleError(err);
  }
}

/**
 * Validates a cjbConfig object.
 * For the list of validations performed, check the documentation for
 * `getCjbConfigAsync`.
 *
 * @param {object} config A cjbConfig object.
 * @returns {void}
 * @throws {Error} When a validation fails.
 */
function validateCjbConfig(config) {
  // `target`
  if (!config.target) {
    throw new Error('cjbConfig.js/jsx must define property `target`');
  }
  switch (config.target) {
    case 'node':
    case 'browser':
      break;
    default:
      throw new Error('`target` in cjbConfig.js/jsx must be' +
      ' one of "node" and "browser"');
  }

  // `webpackConfig`
  if (!config.webpackConfig) {
    throw new Error('cjbConfig.js/jsx must define property `webpackConfig`');
  }
}

/**
 * Reads in the content of `cjbConfig.js/jsx`, compiles it with babel, and
 * return the object which the file exports.
 * Or if that has already been done once, just return the memoized object.
 * Also, in the process, makes the following validations on the obtained object.
 *
 * - `target` must be defined and be one of "node" and "browser"
 * - `webpackConfig` must be defined
 *
 * @async
 * @returns {object} A (cached) object obtained from `cjbConfig.js/jsx`.
 * @throws {Error} When Babel cannot compile the contents of `cjbConfig.js/jsx`.
 * @throws {Error} When a validation on the obtained cjbConfig object fails.
 */
async function getCjbConfigAsync() {
  if (cjbConfigCache !== null) {
    return cjbConfigCache;
  }

  const cjbConfig = await readCjbConfigAsync();

  validateCjbConfig(cjbConfig);

  return cjbConfig;
}

module.exports = getCjbConfigAsync;
