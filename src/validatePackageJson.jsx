const _ = require('lodash');
const fs = require('fs');
const nodeRequire =
  require('module')._load; // eslint-disable-line no-underscore-dangle
const path = require('path');

const cwd = process.cwd();

const projPackageJsonPath = path.join(cwd, 'package.json');
try {
  fs.statSync(projPackageJsonPath);
} catch (unused) {
  throw new Error('Project root must have a file named package.json.');
}
const projPackageJson = nodeRequire(projPackageJsonPath);

const projProdDeps = !projPackageJson.dependencies ? [] :
  Object.keys(projPackageJson.dependencies);
const projDevDeps = !projPackageJson.devDependencies ? [] :
  Object.keys(projPackageJson.devDependencies);

/**
 * Runs the following validations on the target project's package.json, and
 * throws when a violation is met.
 *
 * - When a dependency is listed in both "dependencies" and "devDependencies"
 *
 * @returns {void}
 * @throws {Error} When there's a violation.
 */
function validatePackageJson() {
  const prodDevIntersection =
    _.intersection(projProdDeps, projDevDeps).map(name => `"${name}"`);
  if (prodDevIntersection.length > 0) {
    throw new Error(`Dependencies ${prodDevIntersection.join(', ')} are` +
      ` listed in both "dependencies" and "devDependencies" - what are you` +
      ` trying to do?`);
  }
}

module.exports = validatePackageJson;
