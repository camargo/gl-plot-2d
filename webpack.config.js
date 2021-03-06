const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: __dirname + '/index.ts',

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.glsl' ]
  },

  module: {
    loaders: [
      { test: /node_modules/, loader: 'ify-loader' },
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ]
  },

  output: {
    path: '.',
    filename: 'index.js',
    library: 'glPlot2d',
    libraryTarget: 'umd'
  },

  plugins: [
    new UglifyJSPlugin()
  ],

  performance: {
    hints: false
  }
}
