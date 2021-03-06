// core
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

// interfaces
import { AppraisalRights } from '../../../store';

// people group ids
import { people_fefs } from './../../../../../shared/constants/ids-fefs';
import { people_op } from '../../../../../shared/constants/ids-op';
import { PeopleItem } from '../../../../../shared/interface/people.model';
import { MatButtonToggleGroup } from '@angular/material';

@Component({
  selector: 'app-appraisals-filters-content',
  styleUrls: ['appraisals-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
      <mat-button-toggle-group
        class="by-whom-button-group"
        #filter="matButtonToggleGroup"
        (change)="onByChange.emit(filter.value)"
        *ngIf="position.isFEFS"
      >
        <mat-button-toggle value="byMe" [checked]="true">
          by Me
        </mat-button-toggle>
        <mat-button-toggle value="byOthers">
          by Others
        </mat-button-toggle>
      </mat-button-toggle-group>

      <app-filters-people-single
        class=""
        fxLayout="row wrap"
        [fg_filters]="fg_filters"
        [displayName]="'Given For'"
        [selfUser]="selfUser"
        [includeOnly]="people_op"
        [locationGlobal]="true"
        [default]="defaultGivenFor"
        [disabled]="disabledGivenFor"
        [reset]="reset"
        [resetThis]="resetGivenFor"
        (onSelectUser)="onSelectGivenFor.emit($event)"
      >
      </app-filters-people-single>

      <app-filters-date-range
        class=""
        fxLayout="row wrap"
        fxLayoutAlign="start start"
        [fg_filters]="fg_filters"
        [reset]="reset"
      >
      </app-filters-date-range>
    </div>
  `
})
export class AppraisalsFiltersContentComponent implements OnInit {
  @ViewChild('filter') filter: MatButtonToggleGroup;

  @Input()
  fg_filters: FormGroup;

  @Input()
  locofinterest: number[];

  @Input()
  selfUser: PeopleItem;

  @Input()
  currentUser: PeopleItem;

  @Input()
  position: AppraisalRights;

  @Input()
  reset: boolean;

  @Input()
  resetGivenFor: boolean;

  @Input()
  byWhom: string;

  @Output() onByChange = new EventEmitter<string>();

  @Output()
  updateLocationsofinterest = new EventEmitter<number[]>();

  @Output()
  onSelectGivenBy = new EventEmitter<number>();

  @Output()
  onSelectGivenFor = new EventEmitter<number>();

  people_fefs = people_fefs;
  people_op = people_op;

  constructor() {}

  ngOnInit() {
    // setting default choice
    this.onByChange.emit('byMe');
  }

  get defaultGivenBy() {
    // default user for GivenBy depends on user's position
    // console.log('default given by');

    // if user belongs to FEFS team
    // then default GivenBy should be him/her
    // for other people no preselection needed
    if (this.position.isFEFS) {
      return this.selfUser;
    } else {
      return null;
    }
  }

  get disabledGivenBy() {
    // if user belongs to Reviewers team
    // then he/she can select anybody
    // other people cannot select GivenBy
    if (this.position.isReviewer) {
      return false;
    } else {
      return true;
    }
  }

  get defaultGivenFor() {
    // default user for GivenFor depends on user's position
    // console.log('default GivenFor');

    // if user belongs to OP team
    // then default GivenFor should be him/her
    // for other people no preselection needed
    if (this.position.isOP) {
      return this.selfUser;
    } else {
      return null;
    }
  }

  get disabledGivenFor() {
    console.log('checking');
    // if user belongs to Reviewers team
    // then he/she can select anybody
    // other people cannot select GivenBy
    if (this.position.isReviewer) {
      return false;
    } else if (this.position.isFEFS) {
      if (
        this.byWhom === 'byOthers' &&
        !this.currentUser.DirectReportsId.results.length
      ) {
        console.log('here');
        return true;
      }
      if (
        this.byWhom === 'byOthers' &&
        this.currentUser.DirectReportsId.results.length
      ) {
        return false;
      } else if (this.byWhom === 'byMe') {
        console.log('now here');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
