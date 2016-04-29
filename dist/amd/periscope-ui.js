define(['exports', './bootstrap-dashboard', './default-detailed-view', './default-search-box', './swagger-data-source-configurator'], function (exports, _bootstrapDashboard, _defaultDetailedView, _defaultSearchBox, _swaggerDataSourceConfigurator) {
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
});