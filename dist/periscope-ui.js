import * as _ from 'lodash';
import $ from 'jquery';
import {useView,Container,Decorators,bindable,computedFrom,bindingMode} from 'aurelia-framework';
import {DashboardBase,PermissionsCustomAttribute,StringHelper,IntellisenceManager,GrammarTree,SearchBox,ExpressionParser,Datasource,SwaggerSchemaProvider,DataSourceConfigurator,DrillDownBehaviorConfiguration} from 'periscope-framework';
import {ValidationEngine,Validator} from 'aurelia-validatejs';

export class BootstrapDashboard extends DashboardBase {
  constructor(name) {
    super(name);
    this.widgetBaseHeight = 70;
    this.layoutStructure = [];
    this.currentUrl = "";
  }

  replaceWidget(oldWidget, newWidget, callback){
    super.replaceWidget(oldWidget, newWidget, callback);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  }

  restoreWidget(currentWidget){
    super.restoreWidget(currentWidget);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  }

  addWidget(widget, dimensions){
    super.addWidget(widget, dimensions);
    this.layoutStructure =this.createLayoutStructure(this.layout);
  }

  removeWidget(widget){
    super.removeWidget(widget);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  }

  resizeWidget(widget, dimensions){
    super.resizeWidget(widget, dimensions);
    this.layoutStructure = this.createLayoutStructure(this.layout);
  }

  attached(){
    //this.layoutStructure = this.createLayoutStructure(this.layout);
  }

  createLayoutStructure(layout){
    // sort widgets by row
    var sortedWidgets = _.sortBy(layout, function(w) { return w.row; });
    var result = [];
    _.forOwn(_.groupBy(sortedWidgets, 'row'), (v, k)=>{
      // sort widgets by col
      var sortedByCol = _.sortBy(v, function(w) { return w.col; });
      result.push({
        row: k,
        widgets: sortedByCol
      });
    });
    return result;
  }

  getColWidth(layoutWidget){
    if (layoutWidget.sizeX==="*") {
      var totalX = _.sumBy(this.layout, x => {
        if ((typeof(x.sizeX)==='number')&&(x.row==layoutWidget.row))
          return x.sizeX;
      });
      var x = 12 - (totalX - (Math.floor(totalX / 12)*12));
      return "col-md-" + (x!=0?x:12);
    }
    return "col-md-" + (layoutWidget.sizeX);
  }

  getColHeight(layoutWidget){
    var result = "";
    if (layoutWidget.sizeY==="*") { // stretch down to the screen bottom
      // sum all elemets with predefined height
      var totalHeight = _.sumBy(this.layout, x => {
        if ((typeof(x.sizeY)==='number')&&(layoutWidget.row!==x.row))
          return x.sizeY * this.widgetBaseHeight;
      });
      result = ($('#dashboard')[0].clientHeight - totalHeight);

    }
    else{
      if (layoutWidget.sizeY>0)
        result = layoutWidget.sizeY * this.widgetBaseHeight;
    }
    this.setWidgetHeight(layoutWidget, result);
    return "height: " + result + "px;";
  }

  setWidgetHeight(layoutWidget, containerHeight){
    if (layoutWidget.widget.showHeader)
      layoutWidget.widget.minHeight = containerHeight-71;
    else
      layoutWidget.widget.minHeight = containerHeight-31;
  }


  openPopup() {
    $(this.popWidgetHost).modal('show');
  }

  share(){
    this.currentUrl = super.getRoute();
    $(this.popupShare).modal('show');
    //$(this.shareUrlInput).select();
  }


}




import {DetailedView, Query} from 'periscope-framework'

export class DefaultDetailedView extends DetailedView {

  constructor(settings) {
    super(settings);
  }

  get data(){
    return this._data;
  }
  set data(value){
    this._data = value;
  }

  get viewFields() {
    var result = []
    if (!this.data)
      return result;
    if (this.fields) {
      result = _.map(this.fields, c=>{
        return {
          name: c.title ? c.title : c.field,
          value: this.data[c.field]
        }
      })
    }
    else {
      _.forOwn(this.data, (v, k)=>{
        result.push({
          name: k,
          value: v
        });
      })
    }
    return result;
  }


  refresh(){
    let q = new Query();
    q.take = 1;
    q.skip = 0;
    q.filter = this.dataFilter;
    this.dataSource.getData(q).then(dH=>{
      if (dH.data.length>0)
        this.data = dH.data[0];
    })
  }
}

export class DefaultSearchBox extends SearchBox {
  constructor(settings){
    super(settings);

    this._isValid = true;
    this._caretPosition = 0;

    this._separators = [" ",","];
    this._specialSymbols= ["'","(",")","\""];

    this._timer;

    this._suggestionsListSettings = {
      title:'',
      suggestions:[],
      focusedSuggestion: -1,
      displaySuggestions: false,
      lastWord: ''
    }
  }

  get parser (){
    return this._parser;
  }
  set parser(value){
    this._parser = value;
  }

  get expressionManager (){
    return this._expressionManager;
  }
  set expressionManager(value){
    this._expressionManager = value;
  }

  get selectedSuggestion (){
    return this._selectedSuggestion;
  }

  set selectedSuggestion (value){
    if (this._selectedSuggestion  != value) {
      this._selectedSuggestion = value;
      this.select(this._selectedSuggestion)
    }
  }


  get suggestionsListSettings(){
    return this._suggestionsListSettings;
  }
  set suggestionsListSettings(value){
    this._suggestionsListSettings = value;
  }

  get isValid() {
    if ((this.searchString==='')||(!this.parser))
      return true;
    return this.parser.validate(this.searchString);
  }

  refresh(){
    super.refresh();
    var self = this;

    this.dataSource.transport.readService.getSchema().then(schema=>{
      let allFields = _.map(schema.fields,"field");
      //let grammar = new GrammarExpression(schema.fields);
      let grammar = new GrammarTree(schema.fields);
      self.parser = new ExpressionParser(grammar.getGrammar());
      self.expressionManager = new IntellisenceManager(self.parser, self.dataSource, allFields);
      self.restoreState();
      if (self.state)
        self.suggestionsListSettings.displaySuggestions = false;
    });
  }


  get searchString(){
    return this._searchString;
  }
  set searchString(value){
    if (this._searchString != value) {
      this._searchString = value;
      this.populateSuggestions(value);
      if (this.isValid) {
        this.notifySearchCriteriaChanged();
      }
    }
  }

  get caretPosition(){
    return this._caretPosition;
  }

  set caretPosition(value){
    //$(this.searchBox)[0].selectionStart = value;
    //$(this.searchBox)[0].selectionEnd = value;
    if (value != this._caretPosition) {
      var self = this;
      self._caretPosition = value;
      $(self.searchBox)[0].focus();
      window.setTimeout(()=> {
        $(self.searchBox)[0].setSelectionRange(value, value);
      }, 400);
    }
  }

  attached(){
    var self = this;
    $(this.searchBox)[0].addEventListener("keydown", function (e) {
      if (e.keyCode==40) {
        self.suggestionsListSettings.focusedSuggestion = 0;
        e.preventDefault();
        e.stopPropagation();
      }
      else {
        self.suggestionsListSettings.focusedSuggestion = -1;
        self._caretPosition = this.selectionEnd + 1;
      }

      if ((e.keyCode == 27)||(e.keyCode == 13)){ //escape
        self.suggestionsListSettings.displaySuggestions = false;
      }
    }, true);

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  populateSuggestions(searchStr){

    searchStr = searchStr.substring(0, this.caretPosition);
    var lastWord = this.getLastWord(searchStr)
    this.suggestionsListSettings.title = '';
    this.expressionManager.populate(searchStr, lastWord).then(data=>{
      this.suggestionsListSettings.suggestions =  data;
      this.suggestionsListSettings.lastWord = lastWord;
      this.suggestionsListSettings.displaySuggestions = this.suggestionsListSettings.suggestions.length > 0;
    });

  }

  select(suggestion){
    var searchStr = this.searchString;
    var position = this.caretPosition;
    while ((position<searchStr.length)&&(searchStr[position]!=" ")){
      position++;
    }

    var strLeft = searchStr.substring(0, position);
    var strRight = position < searchStr.length? searchStr.substring(position, searchStr.length) : '';

    var wordToReplace = this.getLastWord(searchStr);
    strLeft = strLeft.substring(0,strLeft.lastIndexOf(wordToReplace));
    var value = suggestion.value;
    if ((suggestion.type==='string')||(suggestion.type==='array_string'))
      value = "'" + value + "'";
    if (suggestion.type==='array_string') {
      // seatch for opening brace
      var openBraceExsits = false;
      for (let i=strLeft.trim().length;i>=0;i--){
        if (strLeft[i]==="(") {
          openBraceExsits = true;
          break;
        }
        if (strLeft[i]===")")
          break;
      }
      if (!openBraceExsits)
        value = "(" + value;
      else {
        var lastChar = strLeft.trim().charAt(strLeft.trim().length - 1);
        if ((lastChar !== '(') && (lastChar !== ','))
          value = "," + value;
      }
    }
    if ((suggestion.type==='operator')&&(suggestion.value==='in'))
      value += " (";
    else
      value += " ";

    this.caretPosition = (strLeft + value).length;
    this.searchString = strLeft + value + strRight;
  }


  getLastWord(searchStr){
    var str = StringHelper.getPreviousWord(searchStr,this.caretPosition,this._separators);
    for (let s of this._specialSymbols)
      str =  StringHelper.replaceAll(str, "\\" + s,"");
    return str.trim();
  }


  notifySearchCriteriaChanged() {
    this.saveState();
    var self = this;
    window.clearTimeout(self._timer);
    self._timer = window.setTimeout(function () {
      if (self.isValid) {
        let astTree;
        if (self.searchString!=='')
          astTree = self.parser.parse(self.searchString)
        self.dataFilterChanged.raise(astTree);
      }
    }, 500);
  }
}

import Swagger from "swagger-client"
export class SwaggerDataSourceConfigurator extends DataSourceConfigurator {
  constructor(settings){
    super(settings);
    this.definitionUrl = settings.definitionsUrl.trim();
    this._initSwaggerClient(this.definitionUrl);
  }

  get client(){
    return this._client;
  }
  set client (value){
    this._client = value;
  }


  get definitionUrl(){
    return this._definitionUrl;
  }
  set definitionUrl(value){
    this._definitionUrl = value;
  }

  get apis(){
    if (this.client)
      return _.map(this.client.apisArray,'name');
    else
      return [];
  }
  @computedFrom("api")
  get methods(){
    if (this.client && this.api){
      let m = []
      _.forOwn(this.client.apis[this.api].apis, a=>{
        if (a.method.toLowerCase() === "get")
          m.push(a.nickname);
      })
      return m;
    }
    else
      return [];
  }

  @computedFrom("method")
  get parameters(){
    if (this.client && this.method && this.api){
      return this.client.apis[this.api].apis[this.method].parameters;
    }
    else
      return [];
  }
  set parameters(value){
    this._parameters = value;
  }

  get api(){
    return this._api;
  }
  set api(value){
    this._api = value;
  }
  get method(){
    return this._method;
  }
  set method(value){
    this._method = value;
  }


  submit(){
    if (!this.dataSourceToConfigurate)
      throw "dataSourceToConfigurate is not provided";
    let ds = this.dataSourceToConfigurate;
    let url = this.client.scheme + "://" + this.client.host + this.client.basePath + this.client.apis[this.api].apis[this.method].path;

    let queryParams = _.map(_.filter(this.parameters, x=>{ return (x.value && x.in == "query")} ), p=>{
      if (p.value)
        return p.name + "=" + p.value
    });

    let definitionModelName;
    let responseDef = this.client[this.api].apis[this.method].successResponse["200"].definition;
    if (responseDef.type === "array") {
      if (responseDef.items.$ref.indexOf('#/definitions/') === 0) {
        if (this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)])
          definitionModelName = this.client.definitions[responseDef.items.$ref.substring('#/definitions/'.length)].name;
      }
    }
    else if (responseDef.name){
      definitionModelName = responseDef.name;
    }


    _.forEach(_.filter(this.parameters, x=>{ return (x.value && x.in == "path")}), pathParam=>{
      url = url.replace("{" + pathParam.name + "}", pathParam.value);
    })


    if (queryParams.length>0)
      url = url + "?" + queryParams.join("&");

    ds.transport.readService.configure({
        url: url,
        schemaProvider: new SwaggerSchemaProvider(this.definitionUrl, this.api, this.method, definitionModelName)
    });
    this.dataSourceChanged.raise(ds);
  }

  _initSwaggerClient(url){
    return new Swagger({
      url: url,
      usePromise: true}).then(client => {
        this.client = client;
    })
  }
}

export class GridMenu {
  
  constructor(widget){
    this.widget = widget;
    this.drillDownModel = new DrillDownModel();
    this.drillDownBehavior = this.getDrillDownBehavior();
    this.availableParams = [];
    if (this.drillDownBehavior){
      this.drillDownModel.query = this.drillDownBehavior.queryPattern;
      this.drillDownModel.url = this.drillDownBehavior.dataServiceUrl;
      this.drillDownModel.username = this.drillDownBehavior.username;
      this.drillDownModel.password = this.drillDownBehavior.password;
    }
    this.widget.dataSource.transport.readService.getSchema().then(schema=> {
      this.availableParams = _.map(schema.fields, f=> {
        return "@" + f.field;
      });
    });

    this.validator = new Validator(this.drillDownModel)
      .ensure('url')
      .url()
      .required()
      .ensure('query')
      .required();
    this.reporter = ValidationEngine.getValidationReporter(this.drillDownModel);
    this.subscriber = this.reporter.subscribe(result => {
      this.renderErrors(result);
    });
  }

  errors = [];
  drillDownModel;
  drillDownBehavior;
  widget;
  validator;



  get showDrillDownButton(){
    let result = false;
    if (!this.drillDownBehavior)
      return result;

    _.forEach(this.widget.dashboard.behaviors,behavior=>{
      if ((behavior)&&(behavior.constructor)&&(behavior.constructor.name === "DrillDownHandleBehavior")){
        result = true;
      }
    })
    return result;
  }

  hasErrors() {
    return !!this.errors.length;
  }

  renderErrors(result) {
    this.errors.splice(0, this.errors.length);
    result.forEach(error => {
      this.errors.push(error)
    });
  }

  closePopup(){
    $(this.popupDrilldown).modal('hide');
  }
  openPopup(){
    $("body").append($(this.popupDrilldown));
    $(this.popupDrilldown).modal('show');
  }

  save(){
    this.validator.validate();
    if (!this.hasErrors()) {
      let configuration = new DrillDownBehaviorConfiguration()
      configuration.queryPattern = this.drillDownModel.query;
      configuration.dataServiceUrl = this.drillDownModel.url;
      configuration.password = this.drillDownModel.password;
      configuration.username = this.drillDownModel.username;

      this.drillDownBehavior.configure(configuration);
      this.closePopup();
    }
  }

  getDrillDownBehavior(){
    let result;
    _.forEach(this.widget.behaviors, behavior=>{
      if ((behavior)&&(behavior.constructor)&&(behavior.constructor.name === "DrillDownBehavior")){
        result = behavior;
      }
    });
    return result;
  }

}

export class DrillDownModel {
  url;
  username;
  password;
  query;
}

export class List {
  @bindable items = null;
  @bindable title = "";
  @bindable highlightText = "";
  @bindable({defaultBindingMode: bindingMode.twoWay}) visible;
  @bindable({defaultBindingMode: bindingMode.twoWay}) selectedItem;
  @bindable({defaultBindingMode: bindingMode.twoWay}) focusedItemIndex;

  constrictor(){
  }


  //itemsChanged(newValue, oldValue)
  attached(params){

      var self = this;

      $("body").on( "click", function(args) {
        if (($(args.target).parents(".list-view").length>0)||($(args.target).hasClass("list-view"))) //do not close when user clicks on the list-view
          return;
        self.visible = false;
      });


      if ($('.list-container').length===0)
        return;
      $('.list-container')[0].addEventListener("keydown", function (e) {
        // Listen for the up, down arrow keys, otherwise, end here
        /*if ([13, 38, 40].indexOf(e.keyCode) == -1) {
          return;
        }*/
        // Store the reference to our top level link
        var container = $(this);

        if (container.find('li').length===0)
          return;

        switch (e.keyCode) {

          case 38: /// up arrow
            if (container.find('li').filter('.focused-item').length===0) {
              self.focusedItemIndex = container.find('li').length-1;
            }
            else{
              let previousIndex  = self.focusedItemIndex - 1;
              if (previousIndex < 0)
                previousIndex = container.find('li').length-1;
              self.focusedItemIndex = previousIndex;
            }
            break;

          case 40: // down arrow

            if (container.find('li').filter('.focused-item').length===0) {
              self.focusedItemIndex = 0;
            }
            else{
              let nextIndex  = self.focusedItemIndex + 1;
              if (nextIndex >= container.find('li').length)
                nextIndex = 0;
              self.focusedItemIndex = nextIndex;
            }
            break;
          case 13: // enter
            if (self.focusedItemIndex>=0) {
                self.select(self.focusedItemIndex);
            }
            break;
          case 27: //escape
            self.visible = false;
            break;
        }
        e.preventDefault();
        e.stopPropagation();
      });

  }


  format(itemText){
    if ((this.highlightText!=='')&&(itemText)&&(itemText.toLowerCase().indexOf(this.highlightText.toLowerCase())>=0)) {
      var regex = new RegExp(this.highlightText, 'i');
      return itemText.replace(regex, '<b>$&</b>');
    }
    return itemText
  }

  select (itemIndex){
    this.selectedItem = this.items[itemIndex];
    this.focusedItemIndex = -1;
  }


  focusedItemIndexChanged(newValue, oldValue) {
    if (this.focusedItemIndex!=undefined) {
      if (this.focusedItemIndex >= 0)
        this.setFocus(this.focusedItemIndex);
      else
        this.clearFocus();
    }
  }

  setFocus(itemIndex) {
    var container = $(this.listViewContainer);
    if (container.find('li').length===0)
      return;
    container.find('li').filter('.focused-item').removeClass("focused-item");
    $(container.find('li')[itemIndex]).addClass("focused-item");
    $(container.find('li')[itemIndex]).find('button').first().focus();
  }

  clearFocus() {
    var container = $(this.listViewContainer);
    if (container.find('li').filter('.focused-item').length===0)
      return;
    container.find('li').filter('.focused-item').first().find('button').first().blur();
    container.find('li').filter('.focused-item').removeClass("focused-item");
  }

}


export class WidgetMenu {
  @bindable widget = {};
  content;
  widgetChanged(oldVal, newVal) {
    if (Object.getPrototypeOf(this.widget.constructor).name==="Grid")
      this.content = new GridMenu(this.widget);
  }

}
