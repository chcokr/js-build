const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));

/**
 * Checks whether an absolute path exists.
 *
 * @param {string} filePath The absolute path.
 * @returns {boolean} Whether the absolute path exists.
 */
async function pathExistsAsync(filePath) {
  try {
    await fs.statAsync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports.pathExistsAsync = pathExistsAsync;
