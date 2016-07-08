'use strict';

System.register(['aurelia-framework', 'periscope-framework', 'swagger-client', 'lodash'], function (_export, _context) {
  "use strict";

  var computedFrom, Datasource, SwaggerSchemaProvider, DataSourceConfigurator, Swagger, _, _typeof, _createClass, _dec, _dec2, _desc, _value, _class, SwaggerDataSourceConfigurator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  return {
    setters: [function (_aureliaFramework) {
      computedFrom = _aureliaFramework.computedFrom;
    }, function (_periscopeFramework) {
      Datasource = _periscopeFramework.Datasource;
      SwaggerSchemaProvider = _periscopeFramework.SwaggerSchemaProvider;
      DataSourceConfigurator = _periscopeFramework.DataSourceConfigurator;
    }, function (_swaggerClient) {
      Swagger = _swaggerClient.default;
    }, function (_lodash) {
      _ = _lodash;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

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

      _export('SwaggerDataSourceConfigurator', SwaggerDataSourceConfigurator = (_dec = computedFrom("api"), _dec2 = computedFrom("method"), (_class = function (_DataSourceConfigurat) {
        _inherits(SwaggerDataSourceConfigurator, _DataSourceConfigurat);

        function SwaggerDataSourceConfigurator(settings) {
          _classCallCheck(this, SwaggerDataSourceConfigurator);

          var _this = _possibleConstructorReturn(this, _DataSourceConfigurat.call(this, settings));

          _this.definitionUrl = settings.definitionsUrl.trim();
          _this._initSwaggerClient(_this.definitionUrl);
          return _this;
        }

        SwaggerDataSourceConfigurator.prototype.submit = function submit() {
          if (!this.dataSourceToConfigurate) throw "dataSourceToConfigurate is not provided";
          var ds = this.dataSourceToConfigurate;
          var url = this.client.scheme + "://" + this.client.host + this.client.basePath + this.client.apis[this.api].apis[this.method].path;

          var queryParams = _.map(_.filter(this.parameters, function (x) {
            return x.value && x.in == "query";
          }), function (p) {
            if (p.value) return p.name + "=" + p.value;
          });

          var definitionModelName = void 0;
          var responseDef = this.client[this.api].apis[this.method].successResponse["200"].definition;
          if (responseDef.type === "array") {
            if (responseDef.items.$ref.indexOf('#/definitions/') === 0) {
              if (this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)]) definitionModelName = this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)].name;
            }
          } else if (responseDef.name) {
            definitionModelName = responseDef.name;
          }

          _.forEach(_.filter(this.parameters, function (x) {
            return x.value && x.in == "path";
          }), function (pathParam) {
            url = url.replace("{" + pathParam.name + "}", pathParam.value);
          });

          if (queryParams.length > 0) url = url + "?" + queryParams.join("&");

          ds.transport.readService.configure({
            url: url,
            schemaProvider: new SwaggerSchemaProvider(this.definitionUrl, this.api, this.method, definitionModelName)
          });
          this.dataSourceChanged.raise(ds);
        };

        SwaggerDataSourceConfigurator.prototype._initSwaggerClient = function _initSwaggerClient(url) {
          var _this2 = this;

          return new Swagger({
            url: url,
            usePromise: true }).then(function (client) {
            _this2.client = client;
          });
        };

        _createClass(SwaggerDataSourceConfigurator, [{
          key: 'client',
          get: function get() {
            return this._client;
          },
          set: function set(value) {
            this._client = value;
          }
        }, {
          key: 'definitionUrl',
          get: function get() {
            return this._definitionUrl;
          },
          set: function set(value) {
            this._definitionUrl = value;
          }
        }, {
          key: 'apis',
          get: function get() {
            if (this.client) return _.map(this.client.apisArray, 'name');else return [];
          }
        }, {
          key: 'methods',
          get: function get() {
            var _this3 = this;

            if (this.client && this.api) {
              var _ret = function () {
                var m = [];
                _.forOwn(_this3.client.apis[_this3.api].apis, function (a) {
                  if (a.method.toLowerCase() === "get") m.push(a.nickname);
                });
                return {
                  v: m
                };
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else return [];
          }
        }, {
          key: 'parameters',
          get: function get() {
            if (this.client && this.method && this.api) {
              return this.client.apis[this.api].apis[this.method].parameters;
            } else return [];
          },
          set: function set(value) {
            this._parameters = value;
          }
        }, {
          key: 'api',
          get: function get() {
            return this._api;
          },
          set: function set(value) {
            this._api = value;
          }
        }, {
          key: 'method',
          get: function get() {
            return this._method;
          },
          set: function set(value) {
            this._method = value;
          }
        }]);

        return SwaggerDataSourceConfigurator;
      }(DataSourceConfigurator), (_applyDecoratedDescriptor(_class.prototype, 'methods', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'methods'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'parameters', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'parameters'), _class.prototype)), _class)));

      _export('SwaggerDataSourceConfigurator', SwaggerDataSourceConfigurator);
    }
  };
});