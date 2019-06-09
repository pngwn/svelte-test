var svelte = require('../require');
var hooks = require('require-extension-hooks');
const { JSDOM } = require('jsdom');
const { join } = require('path');

const preprocessors = join(__dirname, './less.js');
const compilerOptions = { accessors: true };

hooks('.svelte').push(svelte(preprocessors, compilerOptions));

const App = require('./src/components/Compiler.svelte').default;

console.log(App);

const doc = new JSDOM(`<body></body>`, { runScripts: 'dangerously' });
document = doc.window.document;

const app = new App({ target: doc.window.document.body });
console.log(app);
console.log(doc.window.document.body.innerHTML);

app.word = 'Everybody';
console.log(doc.window.document.body.innerHTML);
