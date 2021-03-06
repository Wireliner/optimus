import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromExemptions from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { ExemptionsFormComponent } from '../../forms';

// interfaces
import {
  ExemptionsSearchParams,
  ExemptionItem
} from '../../../../shared/interface/exemptions.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-exemptions.common-app-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-exemptions-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)">
    </app-exemptions-header>

    <app-exemptions-list
      fxFlex class="common-content"
      [exemptions]="data" (openForm)="openForm('view', $event)">
    </app-exemptions-list>

    <app-exemptions-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-exemptions-footer>
  `,
  styleUrls: ['./exemptions.component.scss']
})
export class ExemptionsComponent implements OnInit, OnDestroy {
  appName = 'Exemptions';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: ExemptionItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: ExemptionsSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_exemptions: Store<fromExemptions.ExemptionsState>,
    public form: MatDialog
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // main data = array of exemptions
    this.$data = this.store_exemptions
      .pipe(select(fromExemptions.selectAllExemptions))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_exemptions
      .pipe(select(fromExemptions.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_exemptions
      .select(fromExemptions.getExemptionsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_exemptions
      .select(fromExemptions.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_exemptions.dispatch(
      new fromExemptions.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_exemptions.dispatch(
      new fromExemptions.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_exemptions.dispatch(new fromExemptions.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(ExemptionsFormComponent, {
      data,
      disableClose: true,
      autoFocus: false
    });
    formRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
