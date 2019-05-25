var hooks = require('require-extension-hooks');
const { resolve } = require('path');

var svelte = require('../require');

hooks('.svelte').push(svelte(resolve(__dirname, './less.js')));

const app = require('./src/components/Hello.svelte');

console.log(app);
