const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const pkg = require('./package.json');

module.exports = [

  {
    input: 'src/index.ts',
    output: {
      name: 'SaaSChatWidget',
      file: pkg.unpkg,
      format: 'umd',
      sourcemap: true,
      globals: {
        'socket.io-client': 'io'
      }
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript'
        ]
      }),
      postcss({
        modules: true,
        minimize: true,
        inject: {
          insertAt: 'top'
        }
      }),
      terser()
    ],
    external: ['socket.io-client']
  },


  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript'
        ]
      }),
      postcss({
        modules: true,
        minimize: true,
        inject: false,
        extract: false
      })
    ],
    external: ['socket.io-client']
  }
];
