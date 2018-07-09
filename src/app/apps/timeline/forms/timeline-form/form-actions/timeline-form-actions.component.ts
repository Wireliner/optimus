import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { TimelineEventItem } from '../../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-form-actions',
  styleUrls: ['timeline-form-actions.component.scss'],
  template: `
    <app-timeline-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image">
    </app-timeline-form-actions-new>
    `
})
export class TimelineFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() fg_image: FormGroup;
  //   @Input() initialFields: PeopleItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() updateFormGroupFields = new EventEmitter<TimelineEventItem>();
  @Output()
  updateFormGroupPhoto = new EventEmitter<SpListItemAttachmentFiles[]>();
  @Output() closeForm = new EventEmitter<any>();

  constructor() {}
}
