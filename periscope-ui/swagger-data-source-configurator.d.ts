declare module 'periscope-ui' {
  import {
    computedFrom
  } from 'aurelia-framework';
  import {
    Datasource,
    SwaggerSchemaProvider,
    DataSourceConfigurator
  } from 'periscope-framework';
  import Swagger from 'swagger-client';
  import * as _ from 'lodash';
  export class SwaggerDataSourceConfigurator extends DataSourceConfigurator {
    constructor(settings: any);
    client: any;
    definitionUrl: any;
    apis: any;
    methods: any;
    parameters: any;
    api: any;
    method: any;
    submit(): any;
  }
}