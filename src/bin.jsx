require('babel/polyfill');
require('source-map-support').install();

const runCLIAsync = require('./runCLIAsync.jsx');
const utils = require('./utils.jsx');

(async function () {
  try {

    await runCLIAsync();

  } catch(err) {
    utils.handleError(err);
  }
})();
