declare module 'periscope-ui' {
  import {
    DashboardBase
  } from 'periscope-framework';
  import * as _ from 'lodash';
  import $ from 'jquery';
  export class BootstrapDashboard extends DashboardBase {
    constructor(name: any);
    replaceWidget(oldWidget: any, newWidget: any, callback: any): any;
    restoreWidget(currentWidget: any): any;
    addWidget(widget: any, dimensions: any): any;
    removeWidget(widget: any): any;
    resizeWidget(widget: any, dimensions: any): any;
    attached(): any;
    createLayoutStructure(layout: any): any;
    getColWidth(layoutWidget: any): any;
    getColHeight(layoutWidget: any): any;
    openPopup(): any;
  }
}