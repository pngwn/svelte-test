import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const opts = {
  plugins: [resolve({ preferBuiltins: true }), commonjs()],
};

export default [
  {
    ...opts,
    input: 'src/render.js',
    output: [
      { file: pkg.module, format: 'es', sourcemap: false },
      { file: pkg.main, format: 'cjs', sourcemap: false },
    ],
  },
];
