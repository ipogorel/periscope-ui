define(['exports', 'lodash', 'periscope-framework'], function (exports, _lodash, _periscopeFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DefaultDetailedView = undefined;

  var _ = _interopRequireWildcard(_lodash);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var DefaultDetailedView = exports.DefaultDetailedView = function (_DetailedView) {
    _inherits(DefaultDetailedView, _DetailedView);

    function DefaultDetailedView(settings) {
      _classCallCheck(this, DefaultDetailedView);

      return _possibleConstructorReturn(this, _DetailedView.call(this, settings));
    }

    DefaultDetailedView.prototype.refresh = function refresh() {
      var _this2 = this;

      var q = new _periscopeFramework.Query();
      q.take = 1;
      q.skip = 0;
      q.filter = this.dataFilter;
      this.dataSource.getData(q).then(function (dH) {
        if (dH.data.length > 0) _this2.data = dH.data[0];
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
        var _this3 = this;

        var result = [];
        if (!this.data) return result;
        if (this.fields) {
          result = _.map(this.fields, function (c) {
            return {
              name: c.title ? c.title : c.field,
              value: _this3.data[c.field]
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
});