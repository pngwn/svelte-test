# svelte-test

Testing utilities for Svelte. Currently contains only a Jest transform for Svelte components that supports Svelte Preprocessors.

## `svelte-test/transform`

Install `jest`.

```bash
yarn add --dev jest # or npm i -D jest
```

In your jest config file add `svelte-test/transform` as a transform for Svelte components (whatever file extension you use). Add any preprocessors to `globals.svelte.preprocess`. Your Jest config file will need to be a javascript file.


The `jest.config.js` should look something like this:

```js
module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    "^.+\\.svelte$": "svelte-test/transform",
  },
  globals: {
    svelte: {
      preprocess: preprocess()
    }
  }
};
```

You will probably need to install babel as well, to save you a lifetime of hell I will provide basic instructions.

Install `babel-jest`, `@babel/core`, and `@babel/preset-env`.

```bash
yarn add --dev babel-jest @babel/core @babel/preset-env #or npm i ...
```

Create a `babel.config.js` that looks like this:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["@babel/preset-env", {
        targets: {
          node: 'current',
        },
      }]
    ],
  };
};
```

You can now do this in your tests:

```js
import App from '../App.svelte';

test('The component should exist', () => {
  const component = new App({ target: document.body });

  expect(component).toBeTruthy();
})
```

You may now go on with your life.