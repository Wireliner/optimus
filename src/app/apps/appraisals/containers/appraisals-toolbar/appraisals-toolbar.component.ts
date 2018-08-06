import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-appraisals-toolbar',
  styleUrls: ['appraisals-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-progress-bar *ngIf="searching"
      class="common-searching-indicator" color="primary" mode="indeterminate">
    </mat-progress-bar>

    <app-toolbar-button-menu class="common-toolbar-item">
    </app-toolbar-button-menu>

    <app-toolbar-input-search fxFlex
        [appName]="appName" [fg_params]="fg_params"
        (onFocus)="onFocus.emit()" (onBlur)="onBlur.emit()">
    </app-toolbar-input-search>

    <app-toolbar-button-clear
        *ngIf="fg_params.get('text').value"
        [fg_params]="fg_params">
    </app-toolbar-button-clear>

    <app-toolbar-button-add
      *ngIf="isFEFS"
      [tooltip]="'Create new Appraisal'"
      (openForm)="openForm.emit()">
    </app-toolbar-button-add>
    `
})
export class AppraisalsToolbarComponent {
  @Input() appName: string;
  @Input() searching: boolean;
  @Input() fg_params: FormGroup;
  @Input() isFEFS: boolean;

  @Output() openForm = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();

  constructor() {}

  onClear() {
    this.fg_params.reset();
  }

  // canCreate() {
  //   // later change this, so that only FEs can create appraisals
  //   if (this.accessLevel) {
  //     return this.accessLevel === 3 ? true : false;
  //   } else {
  //     return false;
  //   }
  // }
}