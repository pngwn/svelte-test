const svelte = require('svelte/compiler');
const { execSync } = require('child_process');
const { resolve } = require('path');

module.exports = {
  process: (source, filePath, config, s) => {

    const preprocess = resolve(__dirname, './preprocess.js');
    process.env.jest = true;
    
    let processed = source;
    if (config.globals && config.globals.svelte && config.globals.svelte.preprocess) {
      process.env.sveltest = source;
      processed = execSync(`node ${preprocess}`).toString();
    }
  
    const compiled = svelte.compile(processed, {format: 'cjs'});

    return `${compiled.js.code} 
    module.exports = exports.default;
    `;
  }
};