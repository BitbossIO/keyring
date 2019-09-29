/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');
const common = require('./webpack.common.js');

const {
  NODE_MODULES_PATH,
  DIST_PATH,
} = require('./config/paths');
const {
  cssLoader,
  sassLoader,
  postcssLoader,
} = require('./config/loaders');

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        oneOf: [
          {
            resource: /global/,
            use: [
              'style-loader',
              'css-loader',
              postcssLoader,
              sassLoader,
            ],
          },
          {
            use: [
              'style-loader',
              cssLoader,
              postcssLoader,
              sassLoader,
            ],
          },
        ],
      },
    ],
  },

  output: {
    path: DIST_PATH,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },

  devServer: {
    hot: true,
    port: 3000,
    inline: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    compress: true,
    watchOptions: {
      ignored: NODE_MODULES_PATH,
    },
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
});
