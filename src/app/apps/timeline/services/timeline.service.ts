import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take, retry } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import { TimelineSearchParams } from '../../../shared/interface/timeline.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';
import { SpGetListItemResult } from '../../../shared/interface/sp-list-item.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class TimelineService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithNext(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        retry(3),
        switchMap((response: SpResponse) => {
          // console.log(response);
          if (response.d.results) {
            return of(response);
          }
        })
      );
  }

  buildUrl(params: TimelineSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgTimeline')/items?`;

    // parameters
    const text = params.text ? params.text.replace('#', '%23') : null;
    // locations must be ids array
    const locations = params.locations ? params.locations : [];
    // eventTypes must be ids array
    const eventTypes = params.eventTypes ? params.eventTypes : [];
    // eventReporters must be ids array
    const eventReporters = params.eventReporters ? params.eventReporters : [];
    // if top is missing then default is 100
    let top = params.top ? params.top : 100;

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter is added if one of these is true
    if (text || locations.length) {
      url += `&$filter=`;
    }

    if (text) {
      url += `(`;
      url += `(substringof('${text}',Title))`;
      url += `or(substringof('${text}',Summary))`;
      url += `or(substringof('${text}',HashTags))`;
      url += `)`;
    }

    if (locations.length) {
      if (text) {
        url += 'and';
      }
      url += `${this.getFilterLocations(locations)}`;
    }

    if (eventTypes.length) {
      if (text || locations.length) {
        url += 'and';
      }
      url += `${this.getFilterEventTypes(eventTypes)}`;
    }

    if (eventReporters.length) {
      if (text || locations.length || eventTypes.length) {
        url += 'and';
      }
      url += `${this.getFilterEventReporters(eventReporters)}`;
    }

    // $orderby
    url += `&$orderby=EventDate desc`;

    // $top
    if (top) {
      if (counter) {
        top = 500;
      }
      url += `&$top=${top}`;
    }

    // return combiner url string
    return url;
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'EventDate',
      'Title',
      'Summary',
      'EventTypeId',
      'EventType/Id',
      'EventType/Title',
      'EventReportersId',
      'EventReporters/ID',
      'EventReporters/Alias',
      'EventReporters/Fullname',
      'LocationsId',
      'Locations/Id',
      'Locations/Title',
      'Attachments',
      'AttachmentFiles',
      'RichText',
      'HashTags',
      'Created'
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = [
      'AttachmentFiles',
      'EventType',
      'EventReporters',
      'Locations'
    ];
    return $expand.toString();
  }

  getFilterLocations(locations: number[]) {
    if (locations.length) {
      let filter = '';
      const n = locations.length;
      let i = 1;

      for (const location of locations) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(Locations/Id eq ${location})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }

  getFilterEventTypes(eventTypes: number[]) {
    if (eventTypes.length) {
      let filter = '';
      const n = eventTypes.length;
      let i = 1;

      for (const eventType of eventTypes) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(EventType/Id eq ${eventType})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }

  getFilterEventReporters(eventReporters: number[]) {
    if (eventReporters.length) {
      let filter = '';
      const n = eventReporters.length;
      let i = 1;

      for (const eventReporter of eventReporters) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(EventReporters/Id eq ${eventReporter})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }
}
