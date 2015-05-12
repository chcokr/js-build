const _ = require('lodash');

/**
 * Makes the following validations against the exported object from
 * cjbConfig.js/jsx.
 *
 * - Must define property `target`
 * - `target` must be either "node" or "browser"
 * - Must define *object* property `webpackConfigs`
 * - Each key of `webpackConfigs` must be mapped to an object that contains
 * key `entry`
 * - This key `entry` must be mapped to a string
 *
 * @param {object} cjbConfig The exported object from
 * cjbConfig.js/jsx.
 * @returns {void}
 * @throws {Error} When a validation fails.
 */
function validateCjbConfig(cjbConfig) {
  // `target`
  if (!cjbConfig.target) {
    throw new Error('cjbConfig.js/jsx must define property `target`');
  }
  switch (cjbConfig.target) {
    case 'node':
    case 'browser':
      break;
    default:
      throw new Error('`target` in cjbConfig.js/jsx must be' +
      ' one of "node" and "browser"');
  }

  // `webpackConfigs`
  if (!cjbConfig.webpackConfigs) {
    throw new Error('cjbConfig.js/jsx must define property `webpackConfigs`');
  }
  // Every entry point must have property `entry` set up to a string (a single
  // file)
  const entryPointNames = Object.keys(cjbConfig.webpackConfigs);
  for (let pointName of entryPointNames) {
    const pointConfig = cjbConfig.webpackConfigs[pointName];
    if (!pointConfig.entry) {
      throw new Error(`In cjbConfig.js/jsx, entry point "${pointName}" of` +
        ` \`webpackConfigs\` must define string property \`entry\``);
    }
    if (!_.isString(pointConfig.entry)) {
      throw new Error(`In cjbConfig.js/jsx, entry point "${pointName}" of` +
      ` \`webpackConfigs\` must define *string* property \`entry\``);
    }
  }
}

module.exports = validateCjbConfig;
