const _ = require('lodash');

/**
 * Makes the following validations against the exported object from
 * cjbConfig.js/jsx.
 *
 * - Must define *object* property `webpackConfigs`
 * - Each key of `webpackConfigs` must be mapped to an object that contains
 * key `entry` and key `target`
 * - This key `entry` must be mapped to a string
 * - This key `target` must be either "web" or "node'
 *
 * @param {object} cjbConfig The exported object from
 * cjbConfig.js/jsx.
 * @returns {void}
 * @throws {Error} When a validation fails.
 */
function validateCjbConfig(cjbConfig) {
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

    if (!pointConfig.target) {
      throw new Error(`In cjbConfig.js/jsx, entry point "${pointName}" of` +
      ` \`webpackConfigs\` must define string property \`target\``);
    }
    if (!_.isString(pointConfig.target)) {
      throw new Error(`In cjbConfig.js/jsx, entry point "${pointName}" of` +
      ` \`webpackConfigs\` must define *string* property \`target\``);
    }

    switch (pointConfig.target) {
      case 'node':
      case 'web':
        break;
      default:
        throw new Error('In cjbConfig.js/jsx, property `target` of entry' +
          ` point ${pointName} in \`webpackConfigs\` must be one of "node"` +
          ' or "web" - other webpack targets are not supported by CJB yet.');
    }

  }
}

module.exports = validateCjbConfig;
