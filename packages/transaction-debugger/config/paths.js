const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');

const resolvePath = relativePath => path.resolve(ROOT_PATH, relativePath);


module.exports = {
  APP_PATH:           resolvePath('src'),
  DIST_PATH:          resolvePath('lib'),
  NODE_MODULES_PATH:  resolvePath('node_modules'),
  ASSETS_PATH:        resolvePath('src/assets')
};
