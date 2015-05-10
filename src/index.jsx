const checkPathsExistAsync = require('./checkPathsExistAsync.jsx');
const installPrecommitHookAsync = require('./installPrecommitHookAsync.jsx');
const runBabelAsync = require('./runBabelAsync.jsx');
const runEslintAsync = require('./runEslintAsync.jsx');
const runWebpackAsync = require('./runWebpackAsync.jsx');
const runWebpackDevServerAsync = require('./runWebpackDevServerAsync.jsx');
const utils = require('./utils.jsx');

(async function () {
  try {

    await checkPathsExistAsync();

    await installPrecommitHookAsync();

    await runBabelAsync();

    await runEslintAsync();

    if (process.argv[2] === 'wds') {
      await runWebpackDevServerAsync();
    } else {
      await runWebpackAsync();
    }

  } catch (err) {
    utils.handleError(err);
  }
})();
