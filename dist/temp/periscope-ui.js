'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = exports.SwaggerDataSourceConfigurator = exports.DefaultSearchBox = exports.DefaultDetailedView = exports.BootstrapDashboard = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _dec2, _desc, _value, _class, _dec3, _dec4, _dec5, _desc2, _value2, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _aureliaFramework = require('aurelia-framework');

var _periscopeFramework = require('periscope-framework');

var _swaggerClient = require('swagger-client');

var _swaggerClient2 = _interopRequireDefault(_swaggerClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BootstrapDashboard = exports.BootstrapDashboard = function (_DashboardBase) {
  _inherits(BootstrapDashboard, _DashboardBase);

  function BootstrapDashboard(name) {
    _classCallCheck(this, BootstrapDashboard);

    var _this = _possibleConstructorReturn(this, _DashboardBase.call(this, name));

    _this.widgetBaseHeight = 70;
    _this.layoutStructure = [];
    return _this;
  }

  BootstrapDashboard.prototype.replaceWidget = function replaceWidget(oldWidget, newWidget, callback) {
    _DashboardBase.prototype.replaceWidget.call(this, oldWidget, newWidget, callback);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  };

  BootstrapDashboard.prototype.restoreWidget = function restoreWidget(currentWidget) {
    _DashboardBase.prototype.restoreWidget.call(this, currentWidget);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  };

  BootstrapDashboard.prototype.addWidget = function addWidget(widget, dimensions) {
    _DashboardBase.prototype.addWidget.call(this, widget, dimensions);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  };

  BootstrapDashboard.prototype.removeWidget = function removeWidget(widget) {
    _DashboardBase.prototype.removeWidget.call(this, widget);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  };

  BootstrapDashboard.prototype.resizeWidget = function resizeWidget(widget, dimensions) {
    _DashboardBase.prototype.resizeWidget.call(this, widget, dimensions);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  };

  BootstrapDashboard.prototype.attached = function attached() {};

  BootstrapDashboard.prototype.createLayoutStructure = function createLayoutStructure(layout) {
    var sortedWidgets = _.sortBy(layout, function (w) {
      return w.row;
    });
    var result = [];
    _.forOwn(_.groupBy(sortedWidgets, 'row'), function (v, k) {
      var sortedByCol = _.sortBy(v, function (w) {
        return w.col;
      });
      result.push({
        row: k,
        widgets: sortedByCol
      });
    });
    return result;
  };

  BootstrapDashboard.prototype.getColWidth = function getColWidth(layoutWidget) {
    if (layoutWidget.sizeX === "*") {
      var totalX = _.sumBy(this.layout, function (x) {
        if (typeof x.sizeX === 'number' && x.row == layoutWidget.row) return x.sizeX;
      });
      var x = 12 - (totalX - Math.floor(totalX / 12) * 12);
      return "col-md-" + (x != 0 ? x : 12);
    }
    return "col-md-" + layoutWidget.sizeX;
  };

  BootstrapDashboard.prototype.getColHeight = function getColHeight(layoutWidget) {
    var _this2 = this;

    var result = "";
    if (layoutWidget.sizeY === "*") {
      var totalHeight = _.sumBy(this.layout, function (x) {
        if (typeof x.sizeY === 'number' && layoutWidget.row !== x.row) return x.sizeY * _this2.widgetBaseHeight;
      });
      result = (0, _jquery2.default)('#dashboard')[0].clientHeight - totalHeight;
    } else {
      if (layoutWidget.sizeY > 0) result = layoutWidget.sizeY * this.widgetBaseHeight;
    }
    this.setWidgetHeight(layoutWidget, result);
    return "height: " + result + "px;";
  };

  BootstrapDashboard.prototype.setWidgetHeight = function setWidgetHeight(layoutWidget, containerHeight) {
    if (layoutWidget.widget.showHeader) layoutWidget.widget.minHeight = containerHeight - 71;else layoutWidget.widget.minHeight = containerHeight - 31;
  };

  BootstrapDashboard.prototype.openPopup = function openPopup() {
    (0, _jquery2.default)(this.popWidgetHost).modal('show');
  };

  return BootstrapDashboard;
}(_periscopeFramework.DashboardBase);

var DefaultDetailedView = exports.DefaultDetailedView = function (_DetailedView) {
  _inherits(DefaultDetailedView, _DetailedView);

  function DefaultDetailedView(settings) {
    _classCallCheck(this, DefaultDetailedView);

    return _possibleConstructorReturn(this, _DetailedView.call(this, settings));
  }

  DefaultDetailedView.prototype.refresh = function refresh() {
    var _this4 = this;

    var q = new _periscopeFramework.Query();
    q.take = 1;
    q.skip = 0;
    q.filter = this.dataFilter;
    this.dataSource.getData(q).then(function (dH) {
      if (dH.data.length > 0) _this4.data = dH.data[0];
    });
  };

  _createClass(DefaultDetailedView, [{
    key: 'data',
    get: function get() {
      return this._data;
    },
    set: function set(value) {
      this._data = value;
    }
  }, {
    key: 'viewFields',
    get: function get() {
      var _this5 = this;

      var result = [];
      if (!this.data) return result;
      if (this.fields) {
        result = _.map(this.fields, function (c) {
          return {
            name: c.title ? c.title : c.field,
            value: _this5.data[c.field]
          };
        });
      } else {
        _.forOwn(this.data, function (v, k) {
          result.push({
            name: k,
            value: v
          });
        });
      }
      return result;
    }
  }]);

  return DefaultDetailedView;
}(_periscopeFramework.DetailedView);

var DefaultSearchBox = exports.DefaultSearchBox = function (_SearchBox) {
  _inherits(DefaultSearchBox, _SearchBox);

  function DefaultSearchBox(settings) {
    _classCallCheck(this, DefaultSearchBox);

    var _this6 = _possibleConstructorReturn(this, _SearchBox.call(this, settings));

    _this6._isValid = true;
    _this6._caretPosition = 0;

    _this6._separators = [" ", ","];
    _this6._specialSymbols = ["'", "(", ")", "\""];

    _this6._timer;

    _this6._suggestionsListSettings = {
      title: '',
      suggestions: [],
      focusedSuggestion: -1,
      displaySuggestions: false,
      lastWord: ''
    };
    return _this6;
  }

  DefaultSearchBox.prototype.refresh = function refresh() {
    _SearchBox.prototype.refresh.call(this);
    var self = this;

    this.dataSource.transport.readService.getSchema().then(function (schema) {
      var allFields = _.map(schema.fields, "field");

      var grammar = new _periscopeFramework.GrammarTree(schema.fields);
      self.parser = new _periscopeFramework.ExpressionParser(grammar.getGrammar());
      self.expressionManager = new _periscopeFramework.IntellisenceManager(self.parser, self.dataSource, allFields);
      self.restoreState();
      if (self.state) self.suggestionsListSettings.displaySuggestions = false;
    });
  };

  DefaultSearchBox.prototype.attached = function attached() {
    var self = this;
    (0, _jquery2.default)(this.searchBox)[0].addEventListener("keydown", function (e) {
      if (e.keyCode == 40) {
        self.suggestionsListSettings.focusedSuggestion = 0;
        e.preventDefault();
        e.stopPropagation();
      } else {
        self.suggestionsListSettings.focusedSuggestion = -1;
        self._caretPosition = this.selectionEnd + 1;
      }

      if (e.keyCode == 27 || e.keyCode == 13) {
        self.suggestionsListSettings.displaySuggestions = false;
      }
    }, true);

    (0, _jquery2.default)(function () {
      (0, _jquery2.default)('[data-toggle="tooltip"]').tooltip();
    });
  };

  DefaultSearchBox.prototype.populateSuggestions = function populateSuggestions(searchStr) {
    var _this7 = this;

    searchStr = searchStr.substring(0, this.caretPosition);
    var lastWord = this.getLastWord(searchStr);
    this.suggestionsListSettings.title = '';
    this.expressionManager.populate(searchStr, lastWord).then(function (data) {
      _this7.suggestionsListSettings.suggestions = data;
      _this7.suggestionsListSettings.lastWord = lastWord;
      _this7.suggestionsListSettings.displaySuggestions = _this7.suggestionsListSettings.suggestions.length > 0;
    });
  };

  DefaultSearchBox.prototype.select = function select(suggestion) {
    var searchStr = this.searchString;
    var position = this.caretPosition;
    while (position < searchStr.length && searchStr[position] != " ") {
      position++;
    }

    var strLeft = searchStr.substring(0, position);
    var strRight = position < searchStr.length ? searchStr.substring(position, searchStr.length) : '';

    var wordToReplace = this.getLastWord(searchStr);
    strLeft = strLeft.substring(0, strLeft.lastIndexOf(wordToReplace));
    var value = suggestion.value;
    if (suggestion.type === 'string' || suggestion.type === 'array_string') value = "'" + value + "'";
    if (suggestion.type === 'array_string') {
      var openBraceExsits = false;
      for (var i = strLeft.trim().length; i >= 0; i--) {
        if (strLeft[i] === "(") {
          openBraceExsits = true;
          break;
        }
        if (strLeft[i] === ")") break;
      }
      if (!openBraceExsits) value = "(" + value;else {
        var lastChar = strLeft.trim().charAt(strLeft.trim().length - 1);
        if (lastChar !== '(' && lastChar !== ',') value = "," + value;
      }
    }
    if (suggestion.type === 'operator' && suggestion.value === 'in') value += " (";else value += " ";

    this.caretPosition = (strLeft + value).length;
    this.searchString = strLeft + value + strRight;
  };

  DefaultSearchBox.prototype.getLastWord = function getLastWord(searchStr) {
    var str = _periscopeFramework.StringHelper.getPreviousWord(searchStr, this.caretPosition, this._separators);
    for (var _iterator = this._specialSymbols, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var s = _ref;

      str = _periscopeFramework.StringHelper.replaceAll(str, "\\" + s, "");
    }return str.trim();
  };

  DefaultSearchBox.prototype.notifySearchCriteriaChanged = function notifySearchCriteriaChanged() {
    this.saveState();
    var self = this;
    window.clearTimeout(self._timer);
    self._timer = window.setTimeout(function () {
      if (self.isValid) {
        var astTree = [];
        if (self.searchString !== '') astTree = self.parser.parse(self.searchString);
        self.dataFilterChanged.raise(astTree);
      }
    }, 500);
  };

  _createClass(DefaultSearchBox, [{
    key: 'parser',
    get: function get() {
      return this._parser;
    },
    set: function set(value) {
      this._parser = value;
    }
  }, {
    key: 'expressionManager',
    get: function get() {
      return this._expressionManager;
    },
    set: function set(value) {
      this._expressionManager = value;
    }
  }, {
    key: 'selectedSuggestion',
    get: function get() {
      return this._selectedSuggestion;
    },
    set: function set(value) {
      if (this._selectedSuggestion != value) {
        this._selectedSuggestion = value;
        this.select(this._selectedSuggestion);
      }
    }
  }, {
    key: 'suggestionsListSettings',
    get: function get() {
      return this._suggestionsListSettings;
    },
    set: function set(value) {
      this._suggestionsListSettings = value;
    }
  }, {
    key: 'isValid',
    get: function get() {
      if (this.searchString === '' || !this.parser) return true;
      return this.parser.validate(this.searchString);
    }
  }, {
    key: 'searchString',
    get: function get() {
      return this._searchString;
    },
    set: function set(value) {
      if (this._searchString != value) {
        this._searchString = value;
        this.populateSuggestions(value);
        if (this.isValid) {
          this.notifySearchCriteriaChanged();
        }
      }
    }
  }, {
    key: 'caretPosition',
    get: function get() {
      return this._caretPosition;
    },
    set: function set(value) {
      if (value != this._caretPosition) {
        var self = this;
        self._caretPosition = value;
        (0, _jquery2.default)(self.searchBox)[0].focus();
        window.setTimeout(function () {
          (0, _jquery2.default)(self.searchBox)[0].setSelectionRange(value, value);
        }, 400);
      }
    }
  }]);

  return DefaultSearchBox;
}(_periscopeFramework.SearchBox);

var SwaggerDataSourceConfigurator = exports.SwaggerDataSourceConfigurator = (_dec = (0, _aureliaFramework.computedFrom)("api"), _dec2 = (0, _aureliaFramework.computedFrom)("method"), (_class = function (_DataSourceConfigurat) {
  _inherits(SwaggerDataSourceConfigurator, _DataSourceConfigurat);

  function SwaggerDataSourceConfigurator(settings) {
    _classCallCheck(this, SwaggerDataSourceConfigurator);

    var _this8 = _possibleConstructorReturn(this, _DataSourceConfigurat.call(this, settings));

    _this8.definitionUrl = settings.definitionsUrl.trim();
    _this8._initSwaggerClient(_this8.definitionUrl);
    return _this8;
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
      schemaProvider: new _periscopeFramework.SwaggerSchemaProvider(this.definitionUrl, this.api, this.method, definitionModelName)
    });
    this.dataSourceChanged.raise(ds);
  };

  SwaggerDataSourceConfigurator.prototype._initSwaggerClient = function _initSwaggerClient(url) {
    var _this9 = this;

    return new _swaggerClient2.default({
      url: url,
      usePromise: true }).then(function (client) {
      _this9.client = client;
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
      var _this10 = this;

      if (this.client && this.api) {
        var _ret = function () {
          var m = [];
          _.forOwn(_this10.client.apis[_this10.api].apis, function (a) {
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
}(_periscopeFramework.DataSourceConfigurator), (_applyDecoratedDescriptor(_class.prototype, 'methods', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'methods'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'parameters', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'parameters'), _class.prototype)), _class));
var List = exports.List = (_dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec5 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), (_class2 = function () {
  function List() {
    _classCallCheck(this, List);

    _initDefineProp(this, 'items', _descriptor, this);

    _initDefineProp(this, 'title', _descriptor2, this);

    _initDefineProp(this, 'highlightText', _descriptor3, this);

    _initDefineProp(this, 'visible', _descriptor4, this);

    _initDefineProp(this, 'selectedItem', _descriptor5, this);

    _initDefineProp(this, 'focusedItemIndex', _descriptor6, this);
  }

  List.prototype.constrictor = function constrictor() {};

  List.prototype.attached = function attached(params) {

    var self = this;

    (0, _jquery2.default)("body").on("click", function (args) {
      if ((0, _jquery2.default)(args.target).parents(".list-view").length > 0 || (0, _jquery2.default)(args.target).hasClass("list-view")) return;
      self.visible = false;
    });

    if ((0, _jquery2.default)('.list-container').length === 0) return;
    (0, _jquery2.default)('.list-container')[0].addEventListener("keydown", function (e) {
      var container = (0, _jquery2.default)(this);

      if (container.find('li').length === 0) return;

      switch (e.keyCode) {

        case 38:
          if (container.find('li').filter('.focused-item').length === 0) {
            self.focusedItemIndex = container.find('li').length - 1;
          } else {
            var previousIndex = self.focusedItemIndex - 1;
            if (previousIndex < 0) previousIndex = container.find('li').length - 1;
            self.focusedItemIndex = previousIndex;
          }
          break;

        case 40:

          if (container.find('li').filter('.focused-item').length === 0) {
            self.focusedItemIndex = 0;
          } else {
            var nextIndex = self.focusedItemIndex + 1;
            if (nextIndex >= container.find('li').length) nextIndex = 0;
            self.focusedItemIndex = nextIndex;
          }
          break;
        case 13:
          if (self.focusedItemIndex >= 0) {
            self.select(self.focusedItemIndex);
          }
          break;
        case 27:
          self.visible = false;
          break;
      }
      e.preventDefault();
      e.stopPropagation();
    });
  };

  List.prototype.format = function format(itemText) {
    if (this.highlightText !== '' && itemText && itemText.toLowerCase().indexOf(this.highlightText.toLowerCase()) >= 0) {
      var regex = new RegExp(this.highlightText, 'i');
      return itemText.replace(regex, '<b>$&</b>');
    }
    return itemText;
  };

  List.prototype.select = function select(itemIndex) {
    this.selectedItem = this.items[itemIndex];
    this.focusedItemIndex = -1;
  };

  List.prototype.focusedItemIndexChanged = function focusedItemIndexChanged(newValue, oldValue) {
    if (this.focusedItemIndex != undefined) {
      if (this.focusedItemIndex >= 0) this.setFocus(this.focusedItemIndex);else this.clearFocus();
    }
  };

  List.prototype.setFocus = function setFocus(itemIndex) {
    var container = (0, _jquery2.default)(this.listViewContainer);
    if (container.find('li').length === 0) return;
    container.find('li').filter('.focused-item').removeClass("focused-item");
    (0, _jquery2.default)(container.find('li')[itemIndex]).addClass("focused-item");
    (0, _jquery2.default)(container.find('li')[itemIndex]).find('button').first().focus();
  };

  List.prototype.clearFocus = function clearFocus() {
    var container = (0, _jquery2.default)(this.listViewContainer);
    if (container.find('li').filter('.focused-item').length === 0) return;
    container.find('li').filter('.focused-item').first().find('button').first().blur();
    container.find('li').filter('.focused-item').removeClass("focused-item");
  };

  return List;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'title', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return "";
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'highlightText', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return "";
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'visible', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'selectedItem', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'focusedItemIndex', [_dec5], {
  enumerable: true,
  initializer: null
})), _class2));