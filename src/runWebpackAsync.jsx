const generateModifiedEntryFileAsync =
  require('./generateModifiedEntryFileAsync.jsx');
const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const webpackAsync = Bluebird.promisify(require('webpack'));

/**
 * For each entry point in `webpackConfigs`, generates a temporary copy of the
 * entry file using `generateModifiedEntryFileAsync()`, runs webpack with the
 * same configuration as in `webpackConfigs` except `entry` switched out with
 * the path of the temporary entry file.
 * When webpack is done running, the temporary file is deleted.
 *
 * @async
 * @param {object} webpackConfigs The webpackConfigs as would be defined in
 * `cjbConfig.js/jsx`
 * @returns {void}
 */
async function runWebpackAsync(webpackConfigs) {
  try {

    const entryPoints = Object.keys(webpackConfigs);

    for (let point of entryPoints) {
      const configForThisEntryPoint = webpackConfigs[point];

      const newEntryFilePath =
        await generateModifiedEntryFileAsync(configForThisEntryPoint);

      let newEntryFileConfig = Object.assign({}, configForThisEntryPoint);
      newEntryFileConfig.entry = newEntryFilePath;

      const stats = await webpackAsync(newEntryFileConfig);

      await fs.unlinkAsync(newEntryFilePath);

      console.log(stats.toString({
        cached: false,
        cachedAssets: false,
        colors: true
      }));
    }

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = runWebpackAsync;
