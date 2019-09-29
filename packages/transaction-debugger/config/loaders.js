
const autoprefixer = require('autoprefixer');
const {
  ASSETS_PATH,
} = require('./paths');

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 2,
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    outputStyle: 'expanded',
    includePaths: [
      ASSETS_PATH,
    ],
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer(),
    ],
  },
};

const imagesLoader = {
  loader: 'url-loader',
  options: {
    limit: 8192,
    name: '[name]-[hash].[ext]',
  },
};

const fileLoader = {
  loader: 'file-loader',
  options: {
    limit: 8192,
    name: '[name]-[hash].[ext]',
  },
};


module.exports = {
  cssLoader,
  sassLoader,
  postcssLoader,
  imagesLoader,
  fileLoader,
};
