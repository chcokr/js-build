const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));

/**
 * This function is a thin wrapper around `throw err`.
 * It makes sure the error message is printed out to `stdout`.
 * There are many occasions across JS when the error from `throw err` gets
 * swallowed by the surrounding function and doesn't get printed, causing a
 * hide-and-seek.
 * After printing out the message, this function simply invokes `throw err`.
 *
 * @param {object} err An error, not necessarily of type Error.
 * @returns {void}
 * @throws {Error}
 */
function handleError(err) {
  console.error(err.stack || err);

  throw err;
}

/**
 * Checks whether an absolute path exists.
 *
 * @async
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

module.exports.handleError = handleError;
module.exports.pathExistsAsync = pathExistsAsync;
