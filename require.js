const svelte = require('svelte/compiler');
const { execSync } = require('child_process');
const { join } = require('path');

module.exports = plugins => ({ content }) => {
  const preprocess = join(__dirname, './preprocess.js');

  let processed = content;

  if (plugins) {
    process.env.sveltest = content;
    process.env.svelteplugins = plugins;
    processed = execSync(`node ${preprocess}`).toString();
  }

  const compiled = svelte.compile(processed, { format: 'cjs' });

  return `${compiled.js.code} 
  module.exports = exports.default;
  `;
};
