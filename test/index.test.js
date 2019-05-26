const { render } = require('../src/index.js');
const Hello = require('./src/routes/index.svelte');

test('clicking the button should change the text', async () => {
  const { getByText } = render(Hello);

  const text = getByText('HIGH FIVE!');

  expect(text).toBeTruthy();
});
