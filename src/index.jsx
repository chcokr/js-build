const checkPathsExistAsync = require('./checkPathsExistAsync.jsx');
const installPrecommitHookAsync = require('./installPrecommitHookAsync.jsx');
const runBabelAsync = require('./runBabelAsync.jsx');
const runEslintAsync = require('./runEslintAsync.jsx');
const runWebpackAsync = require('./runWebpackAsync.jsx');
const utils = require('./utils.jsx');

(async function () {
  try {

    await checkPathsExistAsync();

    await installPrecommitHookAsync();

    await runBabelAsync();

    await runEslintAsync();

    await runWebpackAsync();

  } catch (err) {
    utils.handleError(err);
  }
})();
