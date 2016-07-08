define(['exports', 'aurelia-framework', './grid-menu'], function (exports, _aureliaFramework, _gridMenu) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WidgetMenu = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var WidgetMenu = exports.WidgetMenu = (_class = function () {
    function WidgetMenu() {
      _classCallCheck(this, WidgetMenu);

      _initDefineProp(this, 'widget', _descriptor, this);
    }

    WidgetMenu.prototype.widgetChanged = function widgetChanged(oldVal, newVal) {
      if (Object.getPrototypeOf(this.widget.constructor).name === "Grid") this.content = new _gridMenu.GridMenu(this.widget);
    };

    return WidgetMenu;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'widget', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class);
});