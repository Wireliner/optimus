import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store } from '@ngrx/store';
import * as fromTimeline from '../../../../store';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// interfaces
import { TimelineEventItem } from '../../../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-form-actions-edit-fields',
  template: ``
})
export class TimelineFormActionsEditFieldsComponent
  implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;

  @Input()
  initialFields: TimelineEventItem;

  @Output()
  whenUnsavedFieldsChange = new EventEmitter<Object>();

  // combination of individual form control changes
  fc_changes$: Observable<Object>;

  // subscribe to result of scan and map operators
  $maybeUnsavedFields: Subscription;

  constructor(private store: Store<fromTimeline.TimelineState>) {}

  ngOnInit() {
    this.fc_changes$ = merge(
      this.fg_fields.get('Title').valueChanges.pipe(map(Title => ({ Title }))),
      this.fg_fields
        .get('Summary')
        .valueChanges.pipe(map(Summary => ({ Summary }))),
      this.fg_fields
        .get('FollowUp')
        .valueChanges.pipe(map(FollowUp => ({ FollowUp }))),
      this.fg_fields
        .get('QuestRIR')
        .valueChanges.pipe(map(QuestRIR => ({ QuestRIR }))),
      this.fg_fields
        .get('QuestQPID')
        .valueChanges.pipe(map(QuestQPID => ({ QuestQPID }))),
      this.fg_fields
        .get('InTouch')
        .valueChanges.pipe(map(InTouch => ({ InTouch }))),
      this.fg_fields
        .get('RichText')
        .valueChanges.pipe(map(RichText => ({ RichText }))),
      this.fg_fields
        .get('EventType2')
        .valueChanges.pipe(map(EventType2 => ({ EventType2 }))),
      this.fg_fields
        .get('IssueState')
        .valueChanges.pipe(map(IssueState => ({ IssueState }))),
      this.fg_fields
        .get('EventDate')
        .valueChanges.pipe(map(EventDate => ({ EventDate }))),
      this.fg_fields
        .get('LocationsId')
        .valueChanges.pipe(map(LocationsId => ({ LocationsId }))),
      this.fg_fields
        .get('EventReportersId')
        .valueChanges.pipe(map(EventReportersId => ({ EventReportersId })))
    );

    this.$maybeUnsavedFields = this.fc_changes$
      .pipe(
        scan((acc: TimelineEventItem, curr) => {
          const key = Object.keys(curr).toString();
          if (this.initialFields[key] !== curr[key]) {
            return { ...acc, ...curr };
          } else if (this.initialFields[key] === curr[key]) {
            let rest;
            ({ [key]: key, ...rest } = acc);
            return rest;
          }
        }, {}),
        map((fields: TimelineEventItem | {}) => {
          if (Object.keys(fields).length >= 1) {
            return { ...fields, id: this.initialFields['ID'] };
          } else {
            return fields;
          }
        })
      )
      .subscribe((fields: TimelineEventItem | {}) => {
        // console.log(fields);
        this.whenUnsavedFieldsChange.emit(fields);
      });
  }

  ngOnDestroy() {
    this.$maybeUnsavedFields.unsubscribe();
  }
}
