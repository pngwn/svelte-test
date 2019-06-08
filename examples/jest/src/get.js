import { writable } from 'svelte/store';

let uuid = 0;

const getCrops = n => fetch(`./crops/crops-${n}.json`);

const formatData = ({ name, latin }) => ({
  name,
  latin,
  verdict: !!~~(Math.random() * 2),
  id: uuid++,
});

const copy = arr => arr.map(v => ({ ...v }));

export const fetchStore = () => {
  let id = 1,
    cache = [];

  const { update, set, subscribe } = writable({
    status: null,
    data: [],
    next: 1,
  });

  const getSomeCrops = async () => {
    update(s => ({ ...s, status: 'pending' }));

    try {
      const { next, data } = await (await getCrops(id)).json();

      const formatted = data.map(formatData);
      cache = cache.concat(copy(formatted));

      update(s => ({
        status: 'loaded',
        data: [...s.data, ...formatted],
        next,
      }));

      id = next;
    } catch (e) {
      update(s => ({ ...s, status: 'error', message: e.message }));
    }
  };

  const reset = () => set({ status: 'loaded', data: copy(cache), next: id });

  const change = changeId =>
    update(s => {
      const newState = s.data.concat();
      const theOne = newState.find(({ id }) => id === changeId);
      theOne.verdict = !theOne.verdict;
      return { ...s, data: newState };
    });

  const remove = changeId =>
    update(s => ({ ...s, data: s.data.filter(({ id }) => id !== changeId) }));

  const add = ({ name, latin, verdict }) =>
    update(s => ({
      ...s,
      data: [
        ...s.data,
        {
          name,
          latin: latin ? latin : 'Plantywanty Phromthegroundium',
          verdict,
          id: uuid++,
        },
      ],
    }));

  return { subscribe, set, update, getSomeCrops, reset, change, remove, add };
};
