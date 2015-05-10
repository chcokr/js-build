const checkPathsExistAsync = require('./checkPathsExistAsync.jsx');
const getModifiedWebpackConfigAsync =
  require('./getModifiedWebpackConfigAsync.jsx');
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
      const webpackConfig = await getModifiedWebpackConfigAsync();
      await runWebpackDevServerAsync(webpackConfig);
    } else {
      await runWebpackAsync();
    }

  } catch (err) {
    utils.handleError(err);
  }
})();
