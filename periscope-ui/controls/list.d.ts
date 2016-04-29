declare module 'periscope-ui' {
  import {
    bindable,
    bindingMode
  } from 'aurelia-framework';
  import $ from 'jquery';
  export class List {
    items: any;
    title: any;
    highlightText: any;
    visible: any;
    selectedItem: any;
    focusedItemIndex: any;
    constrictor(): any;
    
    //itemsChanged(newValue, oldValue)
    attached(params: any): any;
    format(itemText: any): any;
    select(itemIndex: any): any;
    focusedItemIndexChanged(newValue: any, oldValue: any): any;
    setFocus(itemIndex: any): any;
    clearFocus(): any;
  }
}