'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSearchBox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aureliaFramework = require('aurelia-framework');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _periscopeFramework = require('periscope-framework');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultSearchBox = exports.DefaultSearchBox = function (_SearchBox) {
  _inherits(DefaultSearchBox, _SearchBox);

  function DefaultSearchBox(settings) {
    _classCallCheck(this, DefaultSearchBox);

    var _this = _possibleConstructorReturn(this, _SearchBox.call(this, settings));

    var container = new _aureliaFramework.Container();
    _this._expressionManagerFactory = container.get(_periscopeFramework.DslExpressionManagerFactory);

    _this._searchString = "";

    _this._assumptionString = "";
    _this._isValid = true;
    _this._caretPosition = 0;

    _this._separators = [" ", ","];
    _this._specialSymbols = ["'", "(", ")", "\""];

    _this._timer;

    _this._suggestionsListSettings = {
      title: '',
      suggestions: [],
      focusedSuggestion: -1,
      displaySuggestions: false,
      lastWord: ''
    };
    return _this;
  }

  DefaultSearchBox.prototype.refresh = function refresh() {
    _SearchBox.prototype.refresh.call(this);
    var self = this;
    this._expressionManagerFactory.createInstance(this.dataSource).then(function (x) {
      self.expressionManager = x;
      if (self.state) {
        self.searchString = self.state;
        self.suggestionsListSettings.displaySuggestions = false;
      }
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
    var _this2 = this;

    searchStr = searchStr.substring(0, this.caretPosition);
    var lastWord = this.getLastWord(searchStr);
    this.suggestionsListSettings.title = '';
    this.expressionManager.populate(searchStr, lastWord).then(function (data) {
      _this2.suggestionsListSettings.suggestions = data;

      _this2.suggestionsListSettings.lastWord = lastWord;
      _this2.suggestionsListSettings.displaySuggestions = _this2.suggestionsListSettings.suggestions.length > 0;
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

  DefaultSearchBox.prototype.getAssumptions = function getAssumptions(wrongString, suggestions) {
    var assumptions = [];
    for (var _iterator = suggestions, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var sg = _ref;

      assumptions.push({
        distance: _periscopeFramework.StringHelper.getEditDistance(sg.value.substring(0, wrongString.length), wrongString),
        value: sg.value,
        type: sg.type
      });
    }
    assumptions = assumptions.sort(function (a, b) {
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
      return 0;
    }).splice(0, assumptions.length > 1 ? 1 : assumptions.length);

    return assumptions;
  };

  DefaultSearchBox.prototype.getLastWord = function getLastWord(searchStr) {
    var str = _periscopeFramework.StringHelper.getPreviousWord(searchStr, this.caretPosition, this._separators);
    for (var _iterator2 = this._specialSymbols, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var s = _ref2;

      str = _periscopeFramework.StringHelper.replaceAll(str, "\\" + s, "");
    }return str.trim();
  };

  DefaultSearchBox.prototype.notifySearchCriteriaChanged = function notifySearchCriteriaChanged() {
    if (this.isValid) {
      this.state = this.searchString;
    }
    var self = this;
    self.assumptionString = "";
    window.clearTimeout(self._timer);
    self._timer = window.setTimeout(function () {
      if (self.isValid) {
        var searchExpression = '';
        if (self.searchString !== '') var searchExpression = self.expressionManager.parse(self.searchString);
        self.dataFilterChanged.raise(searchExpression);
      }
    }, 500);
  };

  DefaultSearchBox.prototype.createSearchStringAssumption = function createSearchStringAssumption(searchStr) {
    var maxAttempts = 10;
    var result = "";
    for (var i = 0; i <= maxAttempts; i++) {
      var err = this.expressionManager.getParserError(searchStr);
      if (err.offset < searchStr.length) {
        var wrongStr = _periscopeFramework.StringHelper.getNextWord(searchStr, err.offset, this._separators);
        if (wrongStr.trim().length > 0) {
          var assump = this.getAssumptions(wrongStr, this.expressionManager.populate(searchStr));
          if (assump.length > 0) {
            searchStr = _periscopeFramework.StringHelper.replaceAll(searchStr, wrongStr, assump[0].value);
            if (this.expressionManager.validate(searchStr)) {
              result = searchStr;
              break;
            }
          }
        }
      } else break;
    }
    console.log(result);
    return result;
  };

  DefaultSearchBox.prototype.selectAssumption = function selectAssumption() {
    this.searchString = this.assumptionString;
  };

  _createClass(DefaultSearchBox, [{
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
    key: 'assumptionString',
    get: function get() {
      return this._assumptionString;
    },
    set: function set(value) {
      this._assumptionString = value;
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
      if (this.searchString === '' || !this.expressionManager) return true;
      return this.expressionManager.validate(this.searchString);
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
        this.notifySearchCriteriaChanged();
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
  }, {
    key: 'showAssumption',
    get: function get() {
      return this.assumptionString != '' && !this.suggestionsListSettings.displaySuggestions;
    }
  }]);

  return DefaultSearchBox;
}(_periscopeFramework.SearchBox);