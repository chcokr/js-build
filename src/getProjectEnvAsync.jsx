const utils = require('./utils.jsx');

const nodeRequire =
  require('module')._load; // eslint-disable-line no-underscore-dangle
const path = require('path');

const cwd = process.cwd();

/**
 * If environment.js exists in the project root, import it.
 * Otherwise, import environment.jsx.
 *
 * @returns {object} The imported object.
 */
async function getProjectEnvAsync() {
  const environmentJsExists =
    await utils.pathExistsAsync(path.join(cwd, 'environment.js'));

  const envFilePath =
    path.join(cwd, 'environment.' + (environmentJsExists ? 'js' : 'jsx'));

  return nodeRequire(envFilePath);
}

module.exports = getProjectEnvAsync;
