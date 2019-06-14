const { render, fireEvent } = require('@testing-library/svelte');
const Hello = require('./src/components/Hello.svelte');

test('clicking the button should change the text', async () => {
  const { getByText } = render(Hello);

  const button = getByText('Change');
  const button2 = getByText('Change Again');
  const h1 = getByText('Hello World');

  await fireEvent.click(button);
  expect(h1.innerHTML).toBe('Hello Everybody');

  await fireEvent.click(button2);
  expect(h1.innerHTML).toBe('Hello Nobody');
});
