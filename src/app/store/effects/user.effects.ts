import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import * as fromUser from '../actions/user.action';
import * as fromApplication from '../actions/application.action';

import * as sprLib from 'sprestlib';

import { ApiPath, WirelinePath, ProxyPath } from '../../constants';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect()
  getCurrentUser$ = this.actions$.ofType(fromUser.GET_CURRENT_USER).pipe(
    switchMap(() => sprLib.user().info()),
    mergeMap((data: any) => {
      const email = data.LoginName.replace('i:0#.f|membership|', '');
      const username = email.replace('@slb.com', '');
      const initials = username.substring(0, 2).toUpperCase();

      const currentUser = {
        username: username,
        email: email,
        initials: initials,
        spId: data.Id
      };

      return [
        new fromUser.SetCurrentUser(currentUser),
        new fromUser.CheckCurrentUser(username)
      ];
    })
  );

  @Effect()
  checkCurrentUser$ = this.actions$.ofType(fromUser.CHECK_CURRENT_USER).pipe(
    switchMap((action: fromUser.CheckCurrentUser) => {
      const alias = '%27' + action.payload + '%27';
      return sprLib.list('NgPeople').getItems({
        listCols: [
          'Id',
          'Name',
          'Surname',
          'Alias',
          'Email',
          'Photo',
          'Location'
        ],
        queryFilter: 'Alias eq ' + alias
      });
    }),
    mergeMap((data: any) => {
      if (data.length > 0) {
        const userdata = data[0];
        const api = ApiPath;
        if (api.length === 5) {
          userdata.Photo.Url.replace(WirelinePath, ProxyPath);
        }

        const optimusUserData = {
          isRegistered: true,
          name: userdata.Name,
          surname: userdata.Surname,
          photo: userdata.Photo.Url,
          location: userdata.Location
        };

        return [
          new fromUser.SetOptimusUser(optimusUserData),
          new fromApplication.SetSelectedLocation(userdata.Location)
        ];
      } else {
        console.log(false);
      }
    })
  );
}
