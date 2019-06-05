const transformLess = require('./test/less.js');

module.exports = {
  transform: {
    '^.+\\.svelte$': './transform.js',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    svelte: {
      preprocess: [transformLess],
    },
  },
};
