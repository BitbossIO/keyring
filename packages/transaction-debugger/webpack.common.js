const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const {
  APP_PATH,
  NODE_MODULES_PATH,
  ASSETS_PATH,
} = require('./config/paths');
const {
  alias,
} = require('./config/alias');
const {
  imagesLoader,
  fileLoader,
} = require('./config/loaders');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(APP_PATH, 'index.jsx'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: NODE_MODULES_PATH,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        include: NODE_MODULES_PATH,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        include: [
          ASSETS_PATH,
        ],
        use: [
          imagesLoader,
        ],
      },
      {
        test: /\.woff2?$/,
        include: [
          ASSETS_PATH,
        ],
        use: [
          fileLoader,
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.scss',
    ],
    alias,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './config/template.html',
    }),

    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    new Dotenv(),
  ],
};
