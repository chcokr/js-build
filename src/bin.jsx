require('babel/polyfill');
require('source-map-support').install();

const runAsync = require('./runAsync.jsx');
const utils = require('./utils.jsx');

(async function () {
  try {

    const mode = process.argv[2];
    await runAsync(mode);

  } catch(err) {
    utils.handleError(err);
  }
})();
