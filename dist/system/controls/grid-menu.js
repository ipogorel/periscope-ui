'use strict';

System.register(['aurelia-framework', 'aurelia-validatejs', 'periscope-framework', 'jquery'], function (_export, _context) {
  var computedFrom, ValidationEngine, Validator, DrillDownBehaviorConfiguration, $, _createClass, GridMenu, DrillDownModel;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      computedFrom = _aureliaFramework.computedFrom;
    }, function (_aureliaValidatejs) {
      ValidationEngine = _aureliaValidatejs.ValidationEngine;
      Validator = _aureliaValidatejs.Validator;
    }, function (_periscopeFramework) {
      DrillDownBehaviorConfiguration = _periscopeFramework.DrillDownBehaviorConfiguration;
    }, function (_jquery) {
      $ = _jquery.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GridMenu', GridMenu = function () {
        function GridMenu(widget) {
          var _this = this;

          _classCallCheck(this, GridMenu);

          this.errors = [];

          this.widget = widget;
          this.drillDownModel = new DrillDownModel();
          this.drillDownBehavior = this.getDrillDownBehavior();
          this.availableParams = [];
          if (this.drillDownBehavior) {
            this.drillDownModel.query = this.drillDownBehavior.queryPattern;
            this.drillDownModel.url = this.drillDownBehavior.dataServiceUrl;
            this.drillDownModel.username = this.drillDownBehavior.username;
            this.drillDownModel.password = this.drillDownBehavior.password;
          }
          this.widget.dataSource.transport.readService.getSchema().then(function (schema) {
            _this.availableParams = _.map(schema.fields, function (f) {
              return "@" + f.field;
            });
          });

          this.validator = new Validator(this.drillDownModel).ensure('url').url().required().ensure('query').required();
          this.reporter = ValidationEngine.getValidationReporter(this.drillDownModel);
          this.subscriber = this.reporter.subscribe(function (result) {
            _this.renderErrors(result);
          });
        }

        GridMenu.prototype.hasErrors = function hasErrors() {
          return !!this.errors.length;
        };

        GridMenu.prototype.renderErrors = function renderErrors(result) {
          var _this2 = this;

          this.errors.splice(0, this.errors.length);
          result.forEach(function (error) {
            _this2.errors.push(error);
          });
        };

        GridMenu.prototype.closePopup = function closePopup() {
          $(this.popupDrilldown).modal('hide');
        };

        GridMenu.prototype.openPopup = function openPopup() {
          $("body").append($(this.popupDrilldown));
          $(this.popupDrilldown).modal('show');
        };

        GridMenu.prototype.save = function save() {
          this.validator.validate();
          if (!this.hasErrors()) {
            var configuration = new DrillDownBehaviorConfiguration();
            configuration.queryPattern = this.drillDownModel.query;
            configuration.dataServiceUrl = this.drillDownModel.url;
            configuration.password = this.drillDownModel.password;
            configuration.username = this.drillDownModel.username;

            this.drillDownBehavior.configure(configuration);
            this.closePopup();
          }
        };

        GridMenu.prototype.getDrillDownBehavior = function getDrillDownBehavior() {
          var result = void 0;
          _.forEach(this.widget.behaviors, function (behavior) {
            if (behavior && behavior.constructor && behavior.constructor.name === "DrillDownBehavior") {
              result = behavior;
            }
          });
          return result;
        };

        _createClass(GridMenu, [{
          key: 'showDrillDownButton',
          get: function get() {
            var result = false;
            if (!this.drillDownBehavior) return result;

            _.forEach(this.widget.dashboard.behaviors, function (behavior) {
              if (behavior && behavior.constructor && behavior.constructor.name === "DrillDownHandleBehavior") {
                result = true;
              }
            });
            return result;
          }
        }]);

        return GridMenu;
      }());

      _export('GridMenu', GridMenu);

      _export('DrillDownModel', DrillDownModel = function DrillDownModel() {
        _classCallCheck(this, DrillDownModel);
      });

      _export('DrillDownModel', DrillDownModel);
    }
  };
});