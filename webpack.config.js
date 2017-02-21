const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + '/index.tsx',

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.glsl' ]
  },

  module: {
    loaders: [
      { test: /node_modules/, loader: 'ify-loader' },
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],

  output: {
    path: __dirname + '/dist',
    filename: 'gl-plot-2d.js'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  },

  performance: {
    hints: false
  }
}
