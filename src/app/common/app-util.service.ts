import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class AppUtilService {

  constructor() { }
  safeUnSubscribe(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
