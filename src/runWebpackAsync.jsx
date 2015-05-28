const generateModifiedEntryFileAsync =
  require('./generateModifiedEntryFileAsync.jsx');
const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const webpackAsync = Bluebird.promisify(require('webpack'));

/**
 * For each entry point in `webpackConfigs`, generates a temporary copy of the
 * entry file using
 * `generateModifiedEntryFileAsync(webpackConfig, textToAddAtTopOfEntryFile)`,
 * runs webpack with the same configuration as in `webpackConfig` except `entry`
 * switched out with the path of the temporary entry file.
 * When webpack is done running, the temporary file is deleted.
 *
 * @param {object} webpackConfig The webpackConfig of an entry point as would be
 * defined in `cjbConfig.js/jsx`.
 * @param {string} textToAddAtTopOfEntryFile The text to append at the top of
 * the temporary entry file.
* @returns {void}
*/
async function runWebpackAsync(webpackConfig, textToAddAtTopOfEntryFile = '') {
  try {

    const newEntryFilePath =
      await generateModifiedEntryFileAsync(
        webpackConfig,
        textToAddAtTopOfEntryFile
      );

    let newEntryFileConfig = Object.assign({}, webpackConfig);
    newEntryFileConfig.entry = newEntryFilePath;

    const stats = await webpackAsync(newEntryFileConfig);

    await fs.unlinkAsync(newEntryFilePath);

    console.log(stats.toString({
      cached: false,
      cachedAssets: false,
      colors: true
    }));

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runWebpackAsync;
