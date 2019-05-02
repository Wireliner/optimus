// my shared modules
import { SharedModule } from "../../shared/shared.module";
import { SharedViewComponentsModule } from "../../shared/modules/view-components/shared-view-components.module";

// angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

// ngrx
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { reducers, effects } from "./store";

// 3rd party
import { MaterialModule } from "../../shared/libraries/material.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

// containers
import * as fromContainers from "./containers";

// components
import * as fromComponents from "./components";

// filters
// import * as fromFilters from './containers/jobs-filters/content';

// forms
import * as fromForms from "./forms"; // must go in entry components
import * as fromBatteriesFormControls from "./forms/default-form/form-controls";
import * as fromBatteriesFormActions from "./forms/default-form/form-actions";

// services
import * as fromServices from "./services";

// pipes
// import * as fromPipes from '../../shared/pipes';

// form modules
import { ToolbarButtonsModule } from "../../shared/modules/toolbar-buttons/toolbar-buttons.module";
import { FormControlsModule } from "../../shared/modules/form-controls/form-controls.module";
// import { FilterControlsModule } from '../../shared/modules/filter-controls/form-controls.module';

// routes
export const batteriesRoutes: Routes = [
  { path: "", component: fromContainers.BatteriesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedViewComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(batteriesRoutes),
    StoreModule.forFeature("batteries", reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    FontAwesomeModule,
    // form control modules
    FormControlsModule,
    // toolbar modules
    ToolbarButtonsModule
    // FilterControlsModule,
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    // ...fromFilters.filters,
    ...fromForms.form_dialogs,
    ...fromBatteriesFormControls.forms_controls,
    ...fromBatteriesFormActions.form_actions
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class BatteriesModule {}
