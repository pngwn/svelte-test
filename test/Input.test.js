const { render, updateInput, fireEvent } = require('../src/render.js');
const Inputs = require('./src/components/Inputs.svelte');

const { getByLabelText, getByText, getAllByLabelText } = render(Inputs);

test('updating textareas should work', async () => {
  const input = getByLabelText('Fill in the textarea:');
  const output = getByText(/Value TA:/);

  await updateInput(input, 'Frank');
  expect(output.innerHTML).toBe('Value TA: Frank');
});

test('updating text inputs should work', async () => {
  const input = getByLabelText('Email');
  const output = getByText(/^Value EM:.*/);

  await updateInput(input, 'my@email.com');
  expect(output.innerHTML).toBe('Value EM: my@email.com');
});

test('updating number inputs should work', async () => {
  const input = getByLabelText('Age');
  const output = getByText(/Value NU:/);

  await updateInput(input, 25);
  expect(output.innerHTML).toBe('Value NU: 25');
});

test('updating color inputs should work', async () => {
  const input = getByLabelText('Eye color');
  const output = getByText(/Value CO:/);

  await updateInput(input, '#111111');
  expect(output.innerHTML).toBe('Value CO: #111111');
});

test('updating range inputs should work', async () => {
  const input = getByLabelText('Slidey');
  const output = getByText(/Value RA:/);

  await updateInput(input, 50);
  expect(output.innerHTML).toBe('Value RA: 50');
});

test('updating Checkbox inputs should work', async () => {
  const input = getByLabelText('Is it true what they said?');
  const output = getByText(/Value CB:/);

  await fireEvent.click(input);
  expect(output.innerHTML).toBe('Value CB: false');
});

test('updating Checkbox inputs should work', async () => {
  const input = getAllByLabelText(/Rice|Beans|Cheese|Guac/);
  const output = getByText(/Value CBG:/);

  await input.map(element => fireEvent.click(element));
  expect(output.innerHTML).toBe('Value CBG: Rice,Beans,Cheese,Guac (extra)');
});

test('updating Radio inputs should work', async () => {
  const input = getByLabelText(/Plain/);
  const output = getByText(/Value RAD:/);

  await fireEvent.click(input);
  expect(output.innerHTML).toBe('Value RAD: Plain');
});

test('updating Select elements should work', async () => {
  const input = getByLabelText(/abc/);
  const output = getByText(/Value SE:/);

  await updateInput(input, 'a');
  expect(output.innerHTML).toBe('Value SE: a');
});

test('updating Multi-Select elements should work', async () => {
  const input = getByLabelText(/fillings2/);
  const output = getByText(/Value MS:/);

  await updateInput(input, ['Rice', 'Cheese']);
  expect(output.innerHTML).toBe('Value MS: Rice,Cheese');
});
