const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

/**
 * Copies the content of the file specified by `webpackConfig.entry` into a new
 * path (./index.jsx -> ./_cjb_index.jsx), and appends the following content at
 * the *beginning* of the new file.
 *
 * If `webpackConfig.output.libraryTarget` is defined, nothing significant will
 * be added.
 *
 * Assume `webpackConfig.output.libraryTarget` is undefined from here on.
 *
 * If `webpackConfig.target` is `"node"`, the following is added.
 *
 * ```JS
 * require('chcokr-js-build/dist/polyfill-node');
 * ```
 *
 * If `webpackConfig.target` is `"web"`, the following is added.
 *
 * ```JS
 * require('chcokr-js-build/dist/polyfill-web');
 * ```
 *
 * @param {object} webpackConfig The webpack configuration of the entry point in
 * discussion.
 * @returns {string} The absolute path of the temporary entry file.
 */
async function generateModifiedEntryFileAsync(webpackConfig) {
  let textToAdd = '// Begin: CJB-generated code\n';
  if (!webpackConfig.output.libraryTarget) {
    if (webpackConfig.target === 'node') {
      textToAdd += "require('chcokr-js-build/dist/polyfill-node');\n";
    } else if (webpackConfig.target === 'web') {
      textToAdd += "require('chcokr-js-build/dist/polyfill-web');\n";
    }
  }
  textToAdd += '// End: CJB-generated code\n';

  const entryFileContent = await fs.readFileAsync(webpackConfig.entry);
  const newEntryFileContent = [textToAdd, entryFileContent].join('\n');

  const entryFilePath = path.resolve(webpackConfig.entry);
  const entryFileBaseName = path.basename(entryFilePath);
  const entryFileDirName = path.dirname(entryFilePath);
  const newEntryFileBaseName = `_cjb_${entryFileBaseName}`;
  const newEntryFilePath = path.join(entryFileDirName, newEntryFileBaseName);

  await fs.writeFileAsync(newEntryFilePath, newEntryFileContent);

  return newEntryFilePath;
}

module.exports = generateModifiedEntryFileAsync;
