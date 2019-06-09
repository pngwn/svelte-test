const { render } = require('./util.js');
import Hello from './src/components/Compiler.svelte';

test('accessors should work', async () => {
  const { component, getByText, debug } = render(Hello);

  component.word = 'Everybody';
  expect(() => getByText('Hello Everybody')).not.toThrow();
});
