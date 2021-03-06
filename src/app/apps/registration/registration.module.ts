import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/libraries/material.module';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';
import { NewUserFormPhotoComponent } from './components';

import { ImageCropperModule } from 'ngx-img-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// routes
export const ROUTES: Routes = [
  { path: '', component: fromContainers.RegistrationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MaterialModule,
    FontAwesomeModule,
    ImageCropperModule
  ],
  exports: [RouterModule, ReactiveFormsModule],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  entryComponents: [NewUserFormPhotoComponent],
  providers: []
})
export class RegistrationModule {}
