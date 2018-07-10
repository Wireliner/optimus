import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';

// rxjs
import { Subscription, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map
} from 'rxjs/operators';

// interfaces
import { TimelineSearchParams } from '../../../../shared/interface/timeline.model';

// validators
import { ValidationService } from '../../../../validators/validation.service';

@Component({
  selector: 'app-timeline-header',
  styleUrls: ['timeline-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-timeline-toolbar class="common-toolbar"
      fxFlex fxFlex.gt-xs="568px"
      fxLayout="row nowrap" fxLayoutAlign="start center"
      [appName]="appName" [fg_params]="fg_params" [searching]="searching"
      [accessLevel]="accessLevel"
      (onFocus)="onFocus()" (onBlur)="onBlur()" (openForm)="openForm.emit()"
      [ngClass]="{  focused: focus,
                    invalid: fg_params.get('query').invalid }">
    </app-timeline-toolbar>
    `
})
export class TimelineHeaderComponent implements OnInit, OnDestroy {
  @Input() appName: string;
  @Input() searching: boolean;
  @Input() accessLevel: number;

  @Output() openForm = new EventEmitter<any>();

  fg_params: FormGroup;

  $params: Subscription; // unsubscribed in ngOnDestroy
  $selectedLocations: Subscription; // unsubscribed in ngOnDestroy

  focus = false;

  constructor(
    private fb: FormBuilder,
    private store_timeline: Store<fromTimeline.TimelineState>,
    private store_root: Store<fromRoot.RootState>
  ) {
    this.initializeParamsFormGroup();
    this.subscribeToParamsFormGroup();
    this.resetParamsFormGroup();
  }

  initializeParamsFormGroup() {
    this.fg_params = this.fb.group({
      query: ['', ValidationService.onlySearchable],
      locations: [''],
      top: []
    });
  }

  resetParamsFormGroup() {
    this.fg_params.get('query').patchValue('');
    this.fg_params.get('top').patchValue(10);
  }

  subscribeToParamsFormGroup() {
    // don't pass value after each keystroke, but wait for 600ms
    // don't pass value if it didn't change
    const query$ = this.fg_params.get('query').valueChanges.pipe(
      filter(query => {
        return this.fg_params.get('query').valid;
      }),
      debounceTime(600),
      distinctUntilChanged()
    );

    const locations$ = this.fg_params
      .get('locations')
      .valueChanges.pipe(distinctUntilChanged());

    const top$ = this.fg_params
      .get('top')
      .valueChanges.pipe(distinctUntilChanged());

    const params$ = combineLatest(query$, locations$, top$);

    this.$params = params$
      .pipe(
        map(params => {
          console.log(params);
          return {
            query: params[0],
            locations: params[1],
            top: params[2]
          };
        })
      )
      .subscribe((params: TimelineSearchParams) => {
        console.log('params updated');
        // this action updates store > timeline.params
        // this action is intercepted in search effects
        // search effects triggers chain of actions needed
        // to request events from server and load them in store
        this.store_timeline.dispatch(new fromTimeline.UpdateParams(params));
      });
  }

  ngOnInit() {
    this.subscribeToSelectedLocations();
  }

  subscribeToSelectedLocations() {
    // subscribe to store and update selected location on change
    this.$selectedLocations = this.store_root
      .pipe(select(fromRoot.selectSelectedId))
      .subscribe(location => {
        this.fg_params.get('locations').setValue(location);
      });
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  ngOnDestroy() {
    this.$params.unsubscribe();
    this.$selectedLocations.unsubscribe();
  }
}