# svelte-test

Transforms and examples for testing Svelte components.

There are details on the transforms below. You can view example test setups in [`/examples/`](https://github.com/pngwn/svelte-test/tree/master/examples/).

---

- [I am using Jest](#svelte-testtransform)
- [I am not using Jest](#svelte-testrequire)

---

## svelte-test/transform

Install `jest` and `svelte-test`.

```bash
yarn add --dev jest svelte-test # or npm i -D jest
```

In your jest config file add `svelte-test/transform` as a transform for Svelte components (whatever file extension you use). Add any preprocessors to `globals.svelte.preprocess` and any custom compiler options to `globals.svelte.compilerOptions`. Your Jest config file will need to be a javascript file.

The `jest.config.js` should look something like this:

```js
module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.svelte$': 'svelte-test/transform',
  },
  globals: {
    svelte: {
      preprocess: preprocess(),
      compilerOptions: {
        accessors: true,
      },
    },
  },
};
```

### babel?

You will probably need to install babel as well, to save you a lifetime of hell I will provide basic instructions.

Install `babel-jest`, `@babel/core`, and `@babel/preset-env`.

```bash
yarn add --dev babel-jest @babel/core @babel/preset-env #or npm i ...
```

Create a `babel.config.js` that looks like this:

```js
module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
  };
};
```

### success!

You can now do this in your tests:

```js
import App from '../App.svelte';

test('The component should exist', () => {
  const component = new App({ target: document.body });

  expect(component).toBeTruthy();
});
```

You may now go on with your life.

## svelte-test/require

If you are not using jest you can still hook into node `require`s and get back a real, _genuine_, compiled component. What you do with that component is your business.

Install `require-extension-hooks` and `svelte-test`:

```bash
yarn add --dev require-extension-hooks svelte-test # or npm i ...
```

Wherever you are doing your magic, import `require-extension-hooks` and `svelte-test/require`.

```js
const hooks = require('require-extension-hooks');
const svelte = require('svelte-test/require');
```

You need to pass the `svelte()` function the _absolute path_ to your preprocessors as the first argument and any compiler options as the second argument, I haven't completely thought through the API so this may change in the future. You can then `push` the svelte function as a require hook for your component file extension like so:

```js
const hooks = require('require-extension-hooks');
const svelte = require('svelte-test/require');
const { join } = require('path');

const preprocessors = join(__dirname, './less.js');
const compilerOptions = { accessors: true };

const extensionHook = svelte(preprocessors, compilerOptions);

hooks('.svelte').push(extensionHook);

// You can just require it
const App = require('./App.svelte');

// This is now a constructor function as expected.
const app = new App(options);
```
