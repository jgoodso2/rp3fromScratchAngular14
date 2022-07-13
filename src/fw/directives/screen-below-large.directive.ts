import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { ScreenService } from '../services/screen.service';
import { Subscription } from 'rxjs';
import { AppUtilService } from '../../../src/app/common/app-util.service'

@Directive({selector: '[screenBelowLarge]'})
export class ScreenBelowLarge implements OnDestroy {
  private hasView = false;
  private screenSubscription: Subscription;
  
  constructor(private viewContainer: ViewContainerRef, 
                private template: TemplateRef<Object>,
                private screenService: ScreenService,
              private _appUtilSvc:AppUtilService) {

    this.screenSubscription = screenService.resize$.subscribe(() => this.onResize());

  }

  @Input()
  set screenBelowLarge(condition: any) {
    // ignore the passed condition and set it based on screen size
    condition = this.screenService.screenWidth < this.screenService.largeBreakpoint;
    
    if (condition && !this.hasView) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.template);
    } else if (!condition && this.hasView) {
      this.hasView = false;
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this._appUtilSvc.safeUnSubscribe(this.screenSubscription)
  }

  onResize() {
    // trigger the setter
    this.screenBelowLarge = false;
  }
}
