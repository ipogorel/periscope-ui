export * from './bootstrap-dashboard';
export * from './default-detailed-view';
export * from './default-search-box';
export * from './swagger-data-source-configurator';

export function configure(aurelia) {
  aurelia.globalResources(
    "./bootstrap-dashboard",
    "./default-detailed-view",
    "./default-search-box",
    "./swagger-data-source-configurator"
  );
}
