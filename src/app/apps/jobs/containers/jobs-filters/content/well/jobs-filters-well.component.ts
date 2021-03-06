import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jobs-filters-well',
  styleUrls: ['jobs-filters-well.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters">

      <input
        matInput
        placeholder="Well"
        formControlName="well"
        autocomplete="off">

    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['well'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class JobsFiltersWellComponent {
  @Input()
  fg_filters: FormGroup;

  constructor() {}

  reset() {
    this.fg_filters.controls['well'].reset();
  }
}
