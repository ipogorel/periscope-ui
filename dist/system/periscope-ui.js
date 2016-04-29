'use strict';

System.register(['./bootstrap-dashboard', './default-detailed-view', './default-search-box', './swagger-data-source-configurator'], function (_export, _context) {
  return {
    setters: [function (_bootstrapDashboard) {
      var _exportObj = {};

      for (var _key in _bootstrapDashboard) {
        if (_key !== "default") _exportObj[_key] = _bootstrapDashboard[_key];
      }

      _export(_exportObj);
    }, function (_defaultDetailedView) {
      var _exportObj2 = {};

      for (var _key2 in _defaultDetailedView) {
        if (_key2 !== "default") _exportObj2[_key2] = _defaultDetailedView[_key2];
      }

      _export(_exportObj2);
    }, function (_defaultSearchBox) {
      var _exportObj3 = {};

      for (var _key3 in _defaultSearchBox) {
        if (_key3 !== "default") _exportObj3[_key3] = _defaultSearchBox[_key3];
      }

      _export(_exportObj3);
    }, function (_swaggerDataSourceConfigurator) {
      var _exportObj4 = {};

      for (var _key4 in _swaggerDataSourceConfigurator) {
        if (_key4 !== "default") _exportObj4[_key4] = _swaggerDataSourceConfigurator[_key4];
      }

      _export(_exportObj4);
    }],
    execute: function () {}
  };
});