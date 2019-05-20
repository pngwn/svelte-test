# svelte-test

Testing utilities for Svelte. Currently contains only a Jest transform for Svelte components that supports Svelte Preprocessors.

---

- [I am using Jest](#svelte-testtransform)
- [I am not using Jest](#svelte-testrequire)

---

## svelte-test/transform

Install `jest` and `svelte-test`.

```bash
yarn add --dev jest svelte-test # or npm i -D jest
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

### babel?

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

### success!

You can now do this in your tests:

```js
import App from '../App.svelte';

test('The component should exist', () => {
  const component = new App({ target: document.body });

  expect(component).toBeTruthy();
})
```

You may now go on with your life.

## svelte-test/require

If you are not using jest you can still hook into node `require`s and get back a real, *genuine*, compiled component. What you do with that component is your business.

Install `require-extension-hooks` and `svelte-test`:

```bash
yarn add --dev require-extension-hooks svelte-test # or npm i ...
```

Wherever you are doing your magic, import `require-extension-hooks` and `svelte-test/require`. 


```js
const hooks = require('require-extension-hooks');
const svelte = require('svelte-test/require');
```

You need to pass the `svelte()` function the *absolute path* to your preprocessor, I haven't completely thought through the API so this may change in the future. You can then `push` the svelte function as a require hook for your component file extension like so:

```js
const hooks = require('require-extension-hooks');
const svelte = require('svelte-test/require');

const { resolve } = require('path');
const extensionHook = svelte(resolve(__dirname, './less.js'));

hooks('.svelte').push(extensionHook);

// You can just require it
const App = require('./App.svelte');

// This is now a constructor function as expected.
const app = new App(options)
```



