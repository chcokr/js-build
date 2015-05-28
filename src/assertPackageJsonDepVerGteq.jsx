const _ = require('lodash');
const fs = require('fs');
const nodeRequire =
  require('module')._load; // eslint-disable-line no-underscore-dangle
const path = require('path');
const semver = require('semver');

const cwd = process.cwd();

const projPackageJsonPath = path.join(cwd, 'package.json');
try {
  fs.statSync(projPackageJsonPath);
} catch (unused) {
  throw new Error('Project root must have a file named package.json.');
}
const projPackageJson = nodeRequire(projPackageJsonPath);

/**
 * Asserts that depName is listed in the target project's package.json's
 * "dependencies" (or "devDependencies" if isDevDep is set to true), with a
 * version number at least as high as wantedVer.
 *
 * @param {string} wantedVer The version that depName has to be at least as high
 * as.
 * @param {string} depName The name of the dependency in question.
 * @param {bool} isDevDep Whether the dependency belongs in "dependencies" or
 * "devDependencies".
 * @returns {void}
 * @throws {Error} When `wantedVer` is not a valid semver version.
 * @throws {Error} When the assertion is not met.
 */
function assertPackageJsonDepVerGteq(wantedVer, depName, isDevDep) {
  if (!semver.valid(wantedVer)) {
    throw new Error(`${wantedVer} is not a valid semver version.`);
  }

  const deps = isDevDep ?
    Object.keys(projPackageJson.devDependencies) :
    Object.keys(projPackageJson.dependencies);

  if (!_.contains(deps, depName)) {
    throw new Error(`Project's package.json must contain ${depName}@` +
      wantedVer + ' as a ' +
      (isDevDep ? 'devDependency' : 'dependency (non-dev)') + '.');
  }

  const projDepVer = projPackageJson.devDependencies[depName];
  if (semver.gt(wantedVer, projDepVer)) {
    throw new Error(`Package.json must list ${depName} as a ` +
      (isDevDep ? 'devDependency' : 'dependency (non-dev)') +
      ` at version *${wantedVer}*.` +
      ` Right now it is listed at version ${projDepVer}.` +
      ` Please update it.`);
  }
}

module.exports = assertPackageJsonDepVerGteq;
