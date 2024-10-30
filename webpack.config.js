const path = require('path');

module.exports = {
  entry: './src/index.js', // Ensure this matches your actual entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      fs: false,
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      net: false,
    },
  },
  mode: 'production',
};
