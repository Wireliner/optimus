import * as a_in_app from '../actions/app.actions';

import { Locations } from './../../models/locations.m';

export interface AppState {
  name: string;
  working: boolean;
}

const initialState: AppState = {
  name: null,
  working: false
};

export function reducer(
  state = initialState,
  action: a_in_app.ApplicationActions
): AppState {
  switch (action.type) {
    case a_in_app.SET_APP_NAME:
      return {
        ...state,
        name: action.payload
      };

    case a_in_app.START_WORKING:
      if (state.working === false) {
        return {
          ...state,
          working: true
        };
      } else if (state.working === true) {
        return state;
      } else {
        return state;
      }

    case a_in_app.FINISH_WORKING:
      if (state.working === true) {
        return {
          ...state,
          working: false
        };
      } else if (state.working === false) {
        return state;
      } else {
        return state;
      }

    default:
      return state;
  }
}

// selectors

export const getAppName = (state: AppState) => state.name;
export const getAppWorking = (state: AppState) => state.working;