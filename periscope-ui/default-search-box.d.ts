declare module 'periscope-ui' {
  import {
    Container,
    Decorators,
    bindable
  } from 'aurelia-framework';
  import $ from 'jquery';
  import {
    StringHelper,
    DslExpressionManagerFactory,
    SearchBox
  } from 'periscope-framework';
  export class DefaultSearchBox extends SearchBox {
    constructor(settings: any);
    selectedSuggestion: any;
    assumptionString: any;
    suggestionsListSettings: any;
    isValid: any;
    refresh(): any;
    searchString: any;
    caretPosition: any;
    attached(): any;
    populateSuggestions(searchStr: any): any;
    select(suggestion: any): any;
    getAssumptions(wrongString: any, suggestions: any): any;
    getLastWord(searchStr: any): any;
    notifySearchCriteriaChanged(): any;
    createSearchStringAssumption(searchStr: any): any;
    selectAssumption(): any;
    showAssumption: any;
  }
}