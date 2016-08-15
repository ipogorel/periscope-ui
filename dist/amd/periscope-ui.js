define(['exports', './bootstrap-dashboard', './default-detailed-view', './default-search-box', './swagger-data-source-configurator', 'periscope-framework'], function (exports, _bootstrapDashboard, _defaultDetailedView, _defaultSearchBox, _swaggerDataSourceConfigurator, _periscopeFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_bootstrapDashboard).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _bootstrapDashboard[key];
      }
    });
  });
  Object.keys(_defaultDetailedView).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _defaultDetailedView[key];
      }
    });
  });
  Object.keys(_defaultSearchBox).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _defaultSearchBox[key];
      }
    });
  });
  Object.keys(_swaggerDataSourceConfigurator).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _swaggerDataSourceConfigurator[key];
      }
    });
  });
  exports.configure = configure;
  function configure(aurelia) {
    var pf = aurelia.container.get(_periscopeFramework.PeriscopeFactory);
    pf.addReference(_bootstrapDashboard.BootstrapDashboard);
    pf.addReference(_defaultDetailedView.DefaultDetailedView);
    pf.addReference(_defaultSearchBox.DefaultSearchBox);
    pf.addReference(_swaggerDataSourceConfigurator.SwaggerDataSourceConfigurator);
    aurelia.globalResources("./bootstrap-dashboard", "./default-detailed-view", "./default-search-box", "./swagger-data-source-configurator");
  }
});