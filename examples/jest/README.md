# Jest

Testing svelte components with [Jest](https://jestjs.io/) requires a little setuo but is relatively straighforward. We will walk through the steps here.

# Basic Setup

First we need to install `jest` and `svelte-test` in order to transform Svelte components as we import them.

With [npm](https://www.npmjs.com/):

```bash
npm install --save-dev jest svelte-test
```

Or with [yarn](https://yarnpkg.com/en/):

```bash
yarn add --dev jest svelte-test
```

Now we just need to make sure Svelte components are transformed into valid javascript when they are imported.

Create a `jest.config.js` file in the root of your application and add the following:

```js
module.exports = {
  transform: {
    '^.+\\.svelte$': 'svelte-test/transform',
  },
};
```

\*You can pass additional options to `svelte-test/transform`, see the [`svelte-test` readme] for more details

To run our tests we will need to add a test script to `package.json` like so:

```json
{
  // ...otherConfig,
  "scripts": {
    // ...otherScripts
    "test": "jest"
  }
}
```

You can now import Svelte components and they will be compiled as they are imported, the component constructor will be on the `default` property of the imported object.

```js
const App = require('./App.svelte');

test('a test', () => {
  const app = new App.default({ options });

  expect(app).toBeTruthy();
});
```

## Using babel

You may want to import components into your tests using esm syntax (`import x from './y'`) and perhaps make use of ptehr language fetaures not fully supported in a node environment. To do this we will add a [babel](https://babeljs.io/) transform to make sure our code can run properly in node.

We will need `babel-jest`, `@babel/core`, and `@babel/preset-env`. We will also add `@babel/plugin-transform-runtime` to make sure we can use `async`/`await` syntax in our tests.

With npm:

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/plugin-transform-runtime
```

Or with yarn:

```bash
yarn add --dev babel-jest @babel/core @babel/preset-env @babel/plugin-transform-runtime
```

We will need a `babel.config.js` in the the root of our project that looks like this:

```js
module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime'],
  };
};
```

And we will need to add another transform to our `jest.config.js`, this time for javascript files:

```diff
module.exports = {
  transform: {
    '^.+\\.svelte$': 'svelte-test/transform',
+   '^.+\\.js$': 'babel-jest',
  },
};
```

Now we should be able to write code similar to that in your components:

```js
import App from './App.svelte';

test('a test', () => {
  const app = new App.default({ options });

  expect(app).toBeTruthy();
});
```

## Adding some DOM helpers

DOM testing can get pretty tedious if you need to mount and destroy your components manually, not to mention querying the DOM and firing events to make assertions. Need to access the `default` property of the import everytime might also get annoying.

To ease this pain install `@testing-library/svelte`.

With npm:

```bash
npm install --save-dev @testing-library/svelte
```

Or with yarn:

```bash
yarn add --dev @testing-library/svelte
```

Now we can use `testing-library` helpers to make testing the DOM a little simpler:

```js
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import App from './App.svelte';

afterEach(cleanup);

test('A DOM test', async () => {
  const { getByLabelText, getByText } = render(App, {
    props: { name: 'World' },
  });

  const button = getByLabelText('Submit');
  await fireEvent.click(button);

  expect(() => getByText('Hello Jeremiah')).not.toThrow();
});
```
