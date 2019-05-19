#!/usr/bin/env node

const svelte = require('svelte/compiler');
const cosmiconfig = require('cosmiconfig');
const explorer = cosmiconfig('jest');

explorer.search()
  .then((result) => {
    svelte.preprocess(
      process.env.sveltest, 
      result.config.globals.svelte.preprocess
    ).then(v => {
      process.stdout.write(v.code)
    });
  })
  .catch((error) => {
    throw Error('Something bad happened', error);
  });