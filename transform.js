const svelte = require('svelte/compiler');
const { execSync } = require('child_process');

module.exports = {
  process: (source, filePath, config, s) => {
    
    process.env.sveltest = source;
    const processed = execSync(`node ./preprocess.js`).toString();
    const compiled = svelte.compile(processed, {format: 'cjs'});
  
    return compiled.js.code;
  }
};