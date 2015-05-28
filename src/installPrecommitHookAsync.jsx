const utils = require('./utils.jsx');

const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

const cwd = process.cwd();

/**
 * Copies the content of `./gitPrecommitHook.sh` over to
 * `.git/hooks/pre-commit` and sets the chmod to 755.
 *
 * @returns {void}
 */
async function installPrecommitHookAsync() {
  try {

    console.log('Installing Git pre-commit hook');

    const hookPath = path.join(cwd, '.git', 'hooks', 'pre-commit');

    const hookShellContent = require('raw!./gitPrecommitHook.sh');

    await fs.writeFileAsync(hookPath, hookShellContent);

    await fs.chmodAsync(hookPath, '755');

    console.log('Installing Git pre-commit hook: done');

  } catch (err) {
    utils.handleError(err);
  }
}

module.exports = installPrecommitHookAsync;
