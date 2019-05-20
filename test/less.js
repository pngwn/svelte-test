const less = require('less');

module.exports = function transformLess() {
  return {
    style: async ({ content, attributes, filename }) => {
      if (!attributes.lang || attributes.lang !== 'less')
        return { code: content, map: '' };

      try {
        const { css, map, imports } = await less.render(content, { filename });
        return { code: css, dependencies: imports, map };
      } catch (err) {
        const { line, column, index: character, extract } = err;
        if (!(line && column && extract)) throw err;

        let frame;
        if (!extract[0]) {
          frame = extract.filter(v => v).map((l, i) => `${line + i}:${l}`);
        } else {
          frame = extract.filter(v => v).map((l, i) => `${line - 1 + i}:${l}`);
        }

        frame.splice(2, 0, '^'.padStart(column + line.toString().length + 2));

        delete err.line;
        delete err.column;
        delete err.index;
        delete err.extract;
        err.frame = frame.join('\n');

        err.start = { line, column, character };
        err.end = err.start;

        throw err;
      }
    },
  };
}();