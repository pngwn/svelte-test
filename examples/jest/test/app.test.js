import App from '../src/App.svelte';
import { render } from 'svelte-test';

test('smoke: it should render without throwing', () => {
  expect(() => render(App)).toNotThrow();
});
