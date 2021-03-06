import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-appraisals-form-did-head',
  styleUrls: ['appraisals-form-did-head.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields" fxFlex="100">
      <mat-checkbox formControlName="DidHead" color="primary" [disabled]="disabled">
        <div class="appraisal-skill-description">Prepared Logging Head</div>
      </mat-checkbox>
    </div>
  `
})
export class AppraisalsFormDidHeadComponent implements OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  disabled: boolean;
  formControl = 'DidHead';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // react to form mode changes
    if (changes.mode.currentValue) {
      // check if mode is different
      if (changes.mode.previousValue !== changes.mode.currentValue) {
        this.onModeChange(changes.mode.currentValue);
      }
    }
  }

  onModeChange(newMode: FormMode) {
    console.log('new mode is: ' + newMode);
    if (newMode === 'view') {
      this.disabled = true;
    } else if (newMode === 'new') {
      this.disabled = false;
      this.fg_fields.controls[this.formControl].patchValue(false);
    } else if (newMode === 'edit') {
      this.disabled = false;
    }
  }

  get hasError() {
    return this.fg_fields.get('DidHead').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['DidHead'];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
