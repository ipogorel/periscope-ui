export * from './bootstrap-dashboard';
export * from './default-detailed-view';
export * from './default-search-box';
export * from './swagger-data-source-configurator';

import { PeriscopeFactory } from 'periscope-framework';

import { BootstrapDashboard } from './bootstrap-dashboard';
import { DefaultDetailedView } from './default-detailed-view';
import { DefaultSearchBox } from './default-search-box';
import { SwaggerDataSourceConfigurator } from './swagger-data-source-configurator';

export function configure(aurelia) {
  let pf = aurelia.container.get(PeriscopeFactory);
  pf.addReference(BootstrapDashboard);
  pf.addReference(DefaultDetailedView);
  pf.addReference(DefaultSearchBox);
  pf.addReference(SwaggerDataSourceConfigurator);
  aurelia.globalResources("./bootstrap-dashboard", "./default-detailed-view", "./default-search-box", "./swagger-data-source-configurator");
}