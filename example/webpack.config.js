
module.exports = {
  entry: {
    app: './app.js'
  },

  output: {
    path: __dirname,
    filename: 'index.js',
    chunkFilename: '[id].js'
  },

  module: {
    loaders: [
      { test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['transform-runtime']
        },
      },
    ],
  }
};
