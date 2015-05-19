const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

/**
 * Copies the content of the file specified by `webpackConfig.entry` into a new
 * path (./index.jsx -> ./_cjb_index.jsx), and appends `text` at the *beginning*
 * of the new file.
 *
 * @param {object} webpackConfig The webpack configuration of the entry point in
 * discussion.
 * @param {string} text The text to append to the top of the new temporary
 * entry file.
 * @returns {string} The absolute path of the temporary entry file.
 */
async function generateModifiedEntryFileAsync(webpackConfig, text = '') {
  let textToAdd = '// Begin: CJB-generated code\n';
  textToAdd += text;
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
