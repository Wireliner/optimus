import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, CanActivate } from '@angular/router';

// rxjs 6
import { Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../store';
import * as userActions from '../store/actions/user.actions';
import * as a_in_app from '../store/actions/app.actions';
import * as a_in_locations from '../store/actions/locations.actions';

import { UserService } from '../shared/services/user.service';

// interfaces
import { CurrentUser } from './../models/current-user.m';

@Injectable()
export class AuthGuard implements OnDestroy {
  isRegistered$: Subscription;
  isRegistered: boolean;

  $routerUrl: Subscription;
  currentUrl: string;

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private store: Store<fromRoot.RootState>,
    private userService: UserService
  ) {
    // subscribe to Store and listen to isRegistered
    // when user navigates to other apps isRegistered already available
    this.isRegistered$ = this.store
      .select(fromRoot.getIsRegistered)
      .subscribe(next => {
        this.isRegistered = next;
      });

    this.$routerUrl = this.store
      .pipe(select(fromRoot.getRouterUrl))
      .subscribe(url => (this.currentUrl = url));
  }

  // every time any high level route activated
  // it goes through CanActivate check
  // on first load "isRegistered" will be null
  // so checkRegistration() activated
  canActivate() {
    console.log('CanActivate? checking isRegistered = ' + this.isRegistered);
    return this.isRegistered ? true : this.checkRegistration();
  }

  // first, get current SP user and write it in Store
  // then, take alias and check NgPeople for registration
  // if registered, then take user info and write in Store
  // if not registered, then navigate to Registration page
  checkRegistration() {
    console.log('CanNotActivate. Checking Registration ...');

    return this.userService
      .getLoggedInUser()
      .then((loggedInUser: CurrentUser) => {
        console.log('Got currently logged in user ...');
        console.log(loggedInUser);

        // map logged in user for Store
        const user = this.userService.prepCurrentUserObject(loggedInUser);

        // update store with current user info
        this.store.dispatch(new userActions.SetCurrentUser(user));

        return user.username;
      })
      .then(alias => {
        console.log('Taking user alias: (' + alias + ') ...');
        console.log('and looking in NgPeople list of users ...');
        return this.userService
          .checkLoggedInUserRegistered(alias)
          .toPromise()
          .then((response: any) => {
            // if no user found in NgPeople
            // then response.value will be empty
            const data = response.value[0];
            return data
              ? this.userIsRegistered(data)
              : this.navigateToRegistration();
          });
      });
  }

  navigateToRegistration() {
    console.log('No user found in NgPeople ... navigate to registration.');

    // just for safety confirm that this user is not registered
    this.store.dispatch(new userActions.SetUserNotRegistered(false));

    if (this.currentUrl === '/registration') {
      return true;
    } else {
      this.router.navigate(['/registration']);
    }
  }

  userIsRegistered(optimusUser) {
    console.log('User is registered: ...');
    console.log(optimusUser);

    // map logged in user for Store
    const payload = this.userService.prepOptimusUserObject(optimusUser);

    // update store with optimus user info
    this.store.dispatch(new userActions.SetOptimusUser(payload));

    // meanwhile update user's locations of interest
    this.store.dispatch(
      new a_in_locations.UpdateSelected(payload.locationsOfInterest)
    );

    // grant permission for navigation
    console.log(payload.name + ' can navigate to: ' + this.currentUrl);

    // in case registered user navigated to registration page
    // then redirect to root page
    if (this.currentUrl === '/registration') {
      this.router.navigate(['/']);
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.isRegistered$.unsubscribe();
    this.$routerUrl.unsubscribe();
  }
}
