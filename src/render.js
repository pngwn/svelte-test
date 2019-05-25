import {
  getQueriesForElement,
  prettyDOM,
  fireEvent,
} from 'dom-testing-library';
import { tick } from 'svelte';

export * from 'dom-testing-library';
export const fire = async (event, node, stuff) => {
  fireEvent[event](node, stuff);
  await tick();
};

const mountedContainers = new Set();

export const render = (
  Component,
  { target = document.createElement('div'), ...options } = {}
) => {
  document.body.appendChild(target);

  let ComponentConstructor = Component.default || Component;

  const component = new ComponentConstructor({
    ...options,
    target,
  });

  mountedContainers.add({ target, component });
  return {
    component,
    target,
    // eslint-disable-next-line no-console
    debug: (el = document.body) => console.log(prettyDOM(el)),
    ...getQueriesForElement(document.body),
  };
};

const cleanupAtContainer = container => {
  const { target, component } = container;
  component.$destroy();
  /* istanbul ignore else  */
  if (target.parentNode === document.body) {
    document.body.removeChild(target);
  }
  mountedContainers.delete(container);
};

export const cleanup = () => {
  mountedContainers.forEach(cleanupAtContainer);
};
