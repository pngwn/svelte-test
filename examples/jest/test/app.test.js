import App from '../src/App.svelte';
import { render, cleanup, fireEvent, wait, within } from 'svelte-test';
import mockData from './mockData.js';

// utility function so we can wait a set amount of time
const delay = async t => new Promise(res => setTimeout(res, t));

// utility function to help updating inputs
export function updateInput(node, value) {
  if (node.multiple) {
    Array.from(node.children).forEach(v => {
      if (value.includes(v.value)) {
        v.selected = !v.selected;
      }
    });
    fireEvent.change(node);
    return;
  }
  node.value = value;
  fireEvent.input(node);
}

// mocking fetch since it doesn't exist and i don't want to deal with real data
const fetchMock = jest.fn();

global.fetch = fetchMock.mockImplementation(n => {
  return Promise.resolve({ ok: true, json: () => mockData[n] });
});

// clear the DOM after each test and reset the fetch mock after all tests
afterEach(cleanup);
afterAll(() => (global.fetch = null));

test('smoke: it should compile and render without throwing', () => {
  expect(() => render(App)).not.toThrow();
});

test('Clicking the "Load Crops" button should call fetch', async () => {
  const { getByText } = render(App);

  // load the crops
  const button = getByText('Load more crops');
  fireEvent.click(button);

  expect(fetchMock).toHaveBeenCalled();

  // clear the internal mock data
  fetchMock.mockClear();
});

test('Clicking the "Load Crops" button twice should call fetch twice', async () => {
  const { getByText } = render(App);

  const button = getByText('Load more crops');
  fireEvent.click(button);
  fireEvent.click(button);

  expect(fetchMock).toHaveBeenCalledTimes(2);

  // clear the mock
  fetchMock.mockClear();
});

test('If there are no more items to fetch the "Load Crops" button should not be rendered', async () => {
  const { getByText } = render(App);

  // Load two sets of crops
  const button = getByText('Load more crops');

  // fetch returns a promise, so we need to wait for the  next tick of the event loop for each request
  fireEvent.click(button);
  await wait();
  fireEvent.click(button);
  await wait();

  expect(() => getByText('Load more crops')).toThrowError();
});

test('Clicking the "Load Crops" button should render the items to the DOM', async () => {
  const { getByText, getByLabelText } = render(App);

  // Load the crops
  const button = getByText('Load more crops');

  fireEvent.click(button);
  await wait();

  // instead of just checking the length of the children,
  // we are making sure that the DOM reflects the actual data we loaded
  const findItems = () =>
    Object.values(mockData)[0].data.map(({ name }) =>
      getByLabelText(new RegExp(name))
    );

  expect(findItems).not.toThrow();
});

test('Clicking the "Load Crops" button twice should render both sets of items to the DOM', async () => {
  const { getByText, getByLabelText } = render(App);

  // Load two sets of crops
  const button = getByText('Load more crops');

  fireEvent.click(button);
  await wait();
  fireEvent.click(button);
  await wait();

  // we will concatenate all data resuts to make checking the DOM easier
  const items = [
    ...Object.values(mockData)[0].data,
    ...Object.values(mockData)[1].data,
  ];

  const findItems = () =>
    items.map(({ name }) => getByLabelText(new RegExp(name)));

  expect(findItems).not.toThrow();
});

test('Clicking an individual crop in a section should send it to the opposite', async () => {
  const { getByText, getByTestId } = render(App);

  // Load the crops
  const button = getByText('Load more crops');

  fireEvent.click(button);
  await wait();

  // Get a reference to the crop container elements
  const good = getByTestId('good');
  const bad = getByTestId('bad');

  // Store the length of the containers children before we do anything
  const goodBefore = good.children.length;
  const badBefore = bad.children.length;

  // Toggle an item from good to bad, we need to wait until the transition animation has complete
  fireEvent.click(good.children[0]);
  await delay(450);

  // An items should have gone from good to bad,
  // we are comparing the stored length properties to the current ones to check
  expect(good.children.length).toBe(goodBefore - 1);
  expect(bad.children.length).toBe(badBefore + 1);

  // Toggle another item from bad to good, and wait for the transition to complete
  fireEvent.click(bad.children[0]);
  await delay(450);

  // Things should be back to how they were
  expect(good.children.length).toBe(goodBefore);
  expect(bad.children.length).toBe(badBefore);
});

test('Clicking the "Add Crop/ Hide Menu" button should show and hide the add crop form', async () => {
  const { getByText, getByLabelText } = render(App);

  // Show the form
  const showFormButton = getByText('Add a crop');
  await showFormButton.click();

  // Make sure it is there, these matchers throw errors if there isn't a match
  expect(() => getByLabelText('Common Name')).not.toThrow();

  // Hide the form
  const hideFormButton = getByText('Close menu');
  hideFormButton.click();
  await delay(450);

  expect(() => getByLabelText('Common Name')).toThrow();
});

test('Adding a new crop and submitting the form should make it render into the document', async () => {
  const { getByText, getByLabelText, getByTestId } = render(App);

  // Show the form
  const showFormButton = getByText('Add a crop');
  await showFormButton.click();

  // Fill out the form and submit it
  const nameInput = getByLabelText('Common Name');
  const latinInput = getByLabelText('Latin Name');
  const goodBadInput = getByLabelText(/Verdict: Good or Bad/);
  const submitButton = getByText('Submit');

  updateInput(nameInput, 'A Tree');
  updateInput(latinInput, 'Treeus Maximus');
  fireEvent.click(goodBadInput);
  await fireEvent.click(submitButton);

  // Get the good crop container
  const goodCrops = getByTestId('good');

  expect(() => within(goodCrops).getByText(/A Tree/)).not.toThrow();
  expect(() => within(goodCrops).getByText(/Treeus Maximus/)).not.toThrow();
});

test('Adding a new crop without a name should show a user error and not render into the document', async () => {
  const { getByText, getByTestId } = render(App);

  // Show the form
  const showFormButton = getByText('Add a crop');
  await showFormButton.click();

  // Submit the form without filling it
  const submitButton = getByText('Submit');
  await fireEvent.click(submitButton);

  // Get the good and bad containers
  const goodCrops = getByTestId('good');
  const badCrops = getByTestId('bad');

  expect(() => getByText(/Please enter a name for your crop/)).not.toThrow();
  expect(goodCrops.children.length).toBe(0);
  expect(badCrops.children.length).toBe(0);
});

test('Adding a new crop without a latin name should use the default', async () => {
  const { getByText, getByLabelText, getByTestId } = render(App);

  // SHow the form
  const showFormButton = getByText('Add a crop');
  await showFormButton.click();

  // Fill it out the form but leave the latin name blank
  const nameInput = getByLabelText('Common Name');
  const latinInput = getByLabelText('Latin Name');
  const goodBadInput = getByLabelText(/Verdict: Good or Bad/);
  const submitButton = getByText('Submit');

  updateInput(nameInput, 'A Tree');
  updateInput(latinInput, '');
  fireEvent.click(goodBadInput);
  await fireEvent.click(submitButton);

  // Get the good crop container
  const goodCrops = getByTestId('good');

  expect(() => within(goodCrops).getByText(/A Tree/)).not.toThrow();
  expect(() =>
    within(goodCrops).getByText(/Plantywanty Phromthegroundium/)
  ).not.toThrow();
});

test('Adding a new crop without a latin name should use the default', async () => {
  const { getByText, getByLabelText, getByTestId } = render(App);

  // Load the crops
  const loadCropsbutton = getByText('Load more crops');
  fireEvent.click(loadCropsbutton);
  await wait();

  // Get the quantities of the rendered items
  const good = getByTestId('good');
  const bad = getByTestId('bad');
  const goodBefore = good.children.length;
  const badBefore = bad.children.length;

  // Toggle an item
  fireEvent.click(good.children[0]);
  await delay(450);

  // Show the Add Crop form
  const showFormButton = getByText('Add a crop');
  await showFormButton.click();

  // Add a crop
  const nameInput = getByLabelText('Common Name');
  const latinInput = getByLabelText('Latin Name');
  const goodBadInput = getByLabelText(/Verdict: Good or Bad/);
  const submitButton = getByText('Submit');
  updateInput(nameInput, 'A Tree');
  updateInput(latinInput, '');
  fireEvent.click(goodBadInput);
  await fireEvent.click(submitButton);

  // Reset the crops
  const resetCropsbutton = getByText('Reset crops');
  fireEvent.click(resetCropsbutton);
  await delay(450);

  expect(good.children.length).toBe(goodBefore);
  expect(bad.children.length).toBe(badBefore);
});
