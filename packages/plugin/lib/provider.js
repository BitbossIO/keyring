class Provider {
  static get id() { return 'noid'; }
  static get name() { return 'unnamed'; }
  static get description() { return 'none'; }
  static get version() { return 'none'; }

  static get facets() { return {}; }

  constructor(options={}) {
    let facetClasses = this.constructor.facets;

    this.options = options;
    this.facets = {};

    for (let facet of Object.keys(facetClasses)) {
      this.facets[facet] = new (facetClasses[facet])(this, options);
    }
  }

  get id() { return this.constructor.id; }
  get name() { return this.constructor.name; }
  get description() { return this.constructor.description; }
  get version() { return this.constructor.version; }

  init(facet, hostClass) {
    facet = this.facets[facet];
    if (facet) { facet.init(hostClass); }
  }

  construct(facet, hostInstance) {
    facet = this.facets[facet];
    if (facet) { facet.construct(hostInstance); }
  }
}

module.exports = Provider;
