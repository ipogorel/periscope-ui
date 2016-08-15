'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bootstrapDashboard = require('./bootstrap-dashboard');

Object.keys(_bootstrapDashboard).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _bootstrapDashboard[key];
    }
  });
});

var _defaultDetailedView = require('./default-detailed-view');

Object.keys(_defaultDetailedView).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _defaultDetailedView[key];
    }
  });
});

var _defaultSearchBox = require('./default-search-box');

Object.keys(_defaultSearchBox).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _defaultSearchBox[key];
    }
  });
});

var _swaggerDataSourceConfigurator = require('./swagger-data-source-configurator');

Object.keys(_swaggerDataSourceConfigurator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _swaggerDataSourceConfigurator[key];
    }
  });
});
exports.configure = configure;

var _periscopeFramework = require('periscope-framework');

function configure(aurelia) {
  var pf = aurelia.container.get(_periscopeFramework.PeriscopeFactory);
  pf.addReference(_bootstrapDashboard.BootstrapDashboard);
  pf.addReference(_defaultDetailedView.DefaultDetailedView);
  pf.addReference(_defaultSearchBox.DefaultSearchBox);
  pf.addReference(_swaggerDataSourceConfigurator.SwaggerDataSourceConfigurator);
  aurelia.globalResources("./bootstrap-dashboard", "./default-detailed-view", "./default-search-box", "./swagger-data-source-configurator");
}