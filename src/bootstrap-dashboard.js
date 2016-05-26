import {useView} from 'aurelia-framework';
import {DashboardBase} from 'periscope-framework';
import * as _ from 'lodash';
import $ from 'jquery';

export class BootstrapDashboard extends DashboardBase {
  constructor(name) {
    super(name);
    this.widgetBaseHeight = 70;
    this.layoutStructure = [];
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

}



