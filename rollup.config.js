export default [
  {
    input: './dist/es2015/index.js',
    output: {
      file: './dist/global/index.js',
      format: 'umd',
      sourcemap: true,
      name: "ConsoleInDom"
    }
  }
];