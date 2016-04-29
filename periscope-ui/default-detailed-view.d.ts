declare module 'periscope-ui' {
  import * as _ from 'lodash';
  import {
    DetailedView,
    Query
  } from 'periscope-framework';
  export class DefaultDetailedView extends DetailedView {
    constructor(settings: any);
    data: any;
    viewFields: any;
    refresh(): any;
  }
}