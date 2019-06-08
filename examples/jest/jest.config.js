const transformLess = require('./src/less.js');

module.exports = {
  transform: {
    '^.+\\.svelte$': 'svelte-test/transform',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    svelte: {
      preprocess: [transformLess],
    },
  },
};
