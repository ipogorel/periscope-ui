import { computedFrom } from 'aurelia-framework';
import { ValidationEngine, Validator } from 'aurelia-validatejs';
import { DrillDownBehaviorConfiguration } from 'periscope-framework';
import $ from 'jquery';
import * as _ from 'lodash';

export let GridMenu = class GridMenu {

  constructor(widget) {
    this.errors = [];

    this.widget = widget;
    this.drillDownModel = new DrillDownModel();
    this.drillDownBehavior = this.getDrillDownBehavior();
    this.availableParams = [];
    if (this.drillDownBehavior) {
      this.drillDownModel.query = this.drillDownBehavior.queryPattern;
      this.drillDownModel.url = this.drillDownBehavior.dataServiceUrl;
      this.drillDownModel.username = this.drillDownBehavior.username;
      this.drillDownModel.password = this.drillDownBehavior.password;
    }
    this.widget.dataSource.readService.getSchema().then(schema => {
      this.availableParams = _.map(schema.fields, f => {
        return "@" + f.field;
      });
    });

    this.validator = new Validator(this.drillDownModel).ensure('url').url().required().ensure('query').required();
    this.reporter = ValidationEngine.getValidationReporter(this.drillDownModel);
    this.subscriber = this.reporter.subscribe(result => {
      this.renderErrors(result);
    });
  }

  get showDrillDownButton() {
    let result = false;
    if (!this.drillDownBehavior) return result;

    _.forEach(this.widget.dashboard.behaviors, behavior => {
      if (behavior && behavior.constructor && behavior.constructor.name === "DrillDownHandleBehavior") {
        result = true;
      }
    });
    return result;
  }

  hasErrors() {
    return !!this.errors.length;
  }

  renderErrors(result) {
    this.errors.splice(0, this.errors.length);
    result.forEach(error => {
      this.errors.push(error);
    });
  }

  closePopup() {
    $(this.popupDrilldown).modal('hide');
  }
  openPopup() {
    $("body").append($(this.popupDrilldown));
    $(this.popupDrilldown).modal('show');
  }

  save() {
    this.validator.validate();
    if (!this.hasErrors()) {
      let configuration = new DrillDownBehaviorConfiguration();
      configuration.queryPattern = this.drillDownModel.query;
      configuration.dataServiceUrl = this.drillDownModel.url;
      configuration.password = this.drillDownModel.password;
      configuration.username = this.drillDownModel.username;

      this.drillDownBehavior.configure(configuration);
      this.closePopup();
    }
  }

  getDrillDownBehavior() {
    let result;
    _.forEach(this.widget.behaviors, behavior => {
      if (behavior && behavior.constructor && behavior.constructor.name === "DrillDownBehavior") {
        result = behavior;
      }
    });
    return result;
  }

};

export let DrillDownModel = class DrillDownModel {};