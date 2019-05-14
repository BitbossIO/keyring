const _ = require('@keyring/util');

class Host {
  constructor(facet='default') {
    let plugins = this.constructor.plugins;
    for (let id of Object.keys(plugins)) {
      plugins[id].construct(facet, this);
    }
  }

  static use(provider, refresh) {
    throw new Error('method needs to be added to class');
  }

  static _use(provider, facet, refresh=false) {
    if(refresh || !this.plugins[provider.id]) {
      this.plugins[provider.id] = provider;
      provider.init(facet, this);
    }
  }
}

Host.plugins = {};

module.exports = Host;
