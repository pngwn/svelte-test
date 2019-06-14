const transformLess = require('./test/less.js');

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/examples/'],
  transform: {
    '^.+\\.svelte$': './transform.js',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    svelte: {
      preprocess: [transformLess],
      compilerOptions: {
        accessors: true,
      },
    },
  },
};
