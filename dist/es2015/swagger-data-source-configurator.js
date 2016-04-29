var _dec, _dec2, _desc, _value, _class;

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

import { computedFrom } from 'aurelia-framework';
import { Datasource, SwaggerSchemaProvider, DataSourceConfigurator } from 'periscope-framework';
import Swagger from "swagger-client";
import * as _ from 'lodash';

export let SwaggerDataSourceConfigurator = (_dec = computedFrom("api"), _dec2 = computedFrom("method"), (_class = class SwaggerDataSourceConfigurator extends DataSourceConfigurator {
  constructor(settings) {
    super(settings);
    this.definitionUrl = settings.definitionsUrl.trim();
    this._initSwaggerClient(this.definitionUrl);
  }

  get client() {
    return this._client;
  }
  set client(value) {
    this._client = value;
  }

  get definitionUrl() {
    return this._definitionUrl;
  }
  set definitionUrl(value) {
    this._definitionUrl = value;
  }

  get apis() {
    if (this.client) return _.map(this.client.apisArray, 'name');else return [];
  }

  get methods() {
    if (this.client && this.api) {
      let m = [];
      _.forOwn(this.client.apis[this.api].apis, a => {
        if (a.method.toLowerCase() === "get") m.push(a.nickname);
      });
      return m;
    } else return [];
  }

  get parameters() {
    if (this.client && this.method && this.api) {
      return this.client.apis[this.api].apis[this.method].parameters;
    } else return [];
  }
  set parameters(value) {
    this._parameters = value;
  }

  get api() {
    return this._api;
  }
  set api(value) {
    this._api = value;
  }
  get method() {
    return this._method;
  }
  set method(value) {
    this._method = value;
  }

  submit() {
    if (!this.dataSourceToConfigurate) throw "dataSourceToConfigurate is not provided";
    let ds = this.dataSourceToConfigurate;
    let url = this.client.scheme + "://" + this.client.host + this.client.basePath + this.client.apis[this.api].apis[this.method].path;

    let queryParams = _.map(_.filter(this.parameters, x => {
      return x.value && x.in == "query";
    }), p => {
      if (p.value) return p.name + "=" + p.value;
    });

    let definitionModelName;
    let responseDef = this.client[this.api].apis[this.method].successResponse["200"].definition;
    if (responseDef.type === "array") {
      if (responseDef.items.$ref.indexOf('#/definitions/') === 0) {
        if (this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)]) definitionModelName = this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)].name;
      }
    } else if (responseDef.name) {
      definitionModelName = responseDef.name;
    }

    _.forEach(_.filter(this.parameters, x => {
      return x.value && x.in == "path";
    }), pathParam => {
      url = url.replace("{" + pathParam.name + "}", pathParam.value);
    });

    if (queryParams.length > 0) url = url + "?" + queryParams.join("&");

    ds.transport.readService.configure({
      url: url,
      schemaProvider: new SwaggerSchemaProvider(this.definitionUrl, this.api, this.method, definitionModelName)
    });
    this.dataSourceChanged.raise(ds);
  }

  _initSwaggerClient(url) {
    return new Swagger({
      url: url,
      usePromise: true }).then(client => {
      this.client = client;
    });
  }
}, (_applyDecoratedDescriptor(_class.prototype, 'methods', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'methods'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'parameters', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'parameters'), _class.prototype)), _class));