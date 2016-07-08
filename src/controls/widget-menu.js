import {bindable} from 'aurelia-framework';
import {GridMenu} from './grid-menu';
export class WidgetMenu {
  @bindable widget = {};
  content;
  widgetChanged(oldVal, newVal) {
    if (Object.getPrototypeOf(this.widget.constructor).name==="Grid")
      this.content = new GridMenu(this.widget);
  }

}
