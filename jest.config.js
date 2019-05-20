const transformLess = require('./test/less.js');

module.exports = {
  watchPathIgnorePatterns: ['.+fixtures.+'],
  coveragePathIgnorePatterns: ['node_modules', '.+fixtures.+'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    "^.+\\.svelte$": "./transform.js",
    "^.+\\.js$": "babel-jest",
  },
  globals: {
    svelte: {
      preprocess: [transformLess]
    }
  }
};


