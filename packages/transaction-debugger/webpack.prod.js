const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const {
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
              MiniCssExtractPlugin.loader,
              'css-loader',
              postcssLoader,
              sassLoader,
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
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
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].js.map',
  },

  optimization: {
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }),
  ],
});
