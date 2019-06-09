const svelte = require('svelte/compiler');
const { execSync } = require('child_process');
const { join } = require('path');

module.exports = (preprocessors, compilerOptions) => ({ content }) => {
  const preprocess = join(__dirname, './preprocess.js');

  let processed = content;

  if (preprocessors) {
    process.env.sveltest = content;
    process.env.svelteplugins = preprocessors;
    processed = execSync(`node ${preprocess}`).toString();
  }

  const compiled = svelte.compile(processed, {
    ...compilerOptions,
    format: 'cjs',
  });

  return `${compiled.js.code}`;
};
