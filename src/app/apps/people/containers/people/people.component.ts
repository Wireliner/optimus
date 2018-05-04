import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromPeople from '../../store';
import * as fromRoot from '../../../../store';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// interfaces
import { PeopleItem } from './../../models/people-item.model';
import { PeopleParams } from './../../models/people-params.model';
import { PaginationIndexes } from './../../models/pagination-indexes.model';

// form component
import { PeopleFormComponent } from '../../forms/people-form/people-form.component';

@Component({
  selector: 'app-people',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mat-progress-bar *ngIf="searching"
      class="workingOnRequest" color="warn" mode="indeterminate">
    </mat-progress-bar>

    <app-people-toolbar class="flexToolbar"
      (openForm)="openForm($event)">
    </app-people-toolbar>

    <app-people-list class="flexContent" style="padding: 8px 0;"
      [list]="list" (openItem)="openForm('view', $event)">
    </app-people-list>

    <app-people-toolbar-bottom class="flexFooter"
      [indexes]="indexes" [listLength]="listLength"
      [from]="from" [to]="to" [total]="total"
      (onNext)="onNext($event)" (onBack)="onBack($event)">
    </app-people-toolbar-bottom>

  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  // data
  list$: Subscription;
  list: PeopleItem[];

  total$: Subscription;
  total: any;

  searching$: Subscription;
  searching: boolean;

  // counter
  listLength: number;
  from: number;
  to: number;

  // params
  params$: Subscription;
  params: PeopleParams;

  // pagination
  indexes$: Subscription;
  links$: Subscription;

  // pagination local copy
  indexes: PaginationIndexes;
  links: string[];

  constructor(
    private peopleStore: Store<fromPeople.PeopleState>,
    private rootStore: Store<fromRoot.RootState>,
    public form: MatDialog
  ) {
    this.list$ = this.peopleStore
      .select(fromPeople.getPeopleList)
      .subscribe(list => {
        // goes in people-list component
        this.list = list;

        // go in people-toolbar-bottom component
        this.listLength = list.length;
        if (this.indexes) {
          this.from = this.indexes.current * this.params.top + 1;
          this.to = this.from + this.listLength - 1;
        }

        // count total
        this.countTotalItems(this.params);
      });

    this.total$ = this.peopleStore
      .select(fromPeople.getPeopleTotal)
      .subscribe(total => {
        this.total = total;
      });

    this.searching$ = this.peopleStore
      .select(fromPeople.getPeopleSearching)
      .subscribe(search => {
        this.searching = search;
      });
  }

  ngOnInit() {
    // this fix is to make content of People to fill full height
    const app_people = document.getElementsByTagName('app-people')[0];
    app_people ? app_people.setAttribute('class', 'flexContainer') : '';

    // update html page title
    this.rootStore.dispatch(new fromRoot.ChangeAppName(this.appName));

    // subscribe to indexes
    this.indexes$ = this.peopleStore
      .select(fromPeople.getPageIndexes)
      .subscribe(indexes => (this.indexes = indexes));

    // monitor current index, trigger search when changed
    this.params$ = this.peopleStore
      .select(fromPeople.getParams)
      .subscribe(params => {
        this.params = params;
      });

    // subscribe to search pagelinks
    this.links$ = this.peopleStore
      .select(fromPeople.getPageLinks)
      .subscribe(links => {
        this.links = links;
      });
  }

  onNext(indexes: PaginationIndexes) {
    this.peopleStore.dispatch(new fromPeople.OnNext(this.links[indexes.next]));
  }

  onBack(indexes: PaginationIndexes) {
    this.peopleStore.dispatch(
      new fromPeople.OnBack(this.links[indexes.previous])
    );
  }

  countTotalItems(params) {
    if (params) {
      this.peopleStore.dispatch(new fromPeople.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(PeopleFormComponent, { data });
  }

  ngOnDestroy() {
    this.list$.unsubscribe();
    this.total$.unsubscribe();
    this.indexes$.unsubscribe();
    this.params$.unsubscribe();
    this.links$.unsubscribe();
  }
}