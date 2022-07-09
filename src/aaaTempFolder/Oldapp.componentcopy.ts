import { Component,OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { FrameworkConfigService, FrameworkConfigSettings  } from '../fw/services/framework-config.service'  
import  { MenuService } from '../fw/services/menu.service'
import { initialMenuItems  } from './app.menu'

import { AppStateService } from './services/app-state.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  hello: string = 'hello world';
  title = 'Resource Planner V2';
  loading: boolean

  constructor(

    private router: Router,
    private _appSvc: AppStateService,
    private _frameworkConfigService: FrameworkConfigService,
    private _menuService: MenuService) {
    _appSvc.loading$.subscribe(val => this.loading = val)
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    }, (error) => console.log(error));

    let config:FrameworkConfigSettings = {
    
      showLanguageSelector: true,
      showUserControls: true,
      showStatusBar: true,
      showStatusBarBreakpoint: 800
    };

    _frameworkConfigService.configure(config);

    _menuService.items = initialMenuItems;

  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  onLoading(val: boolean) {
    console.log('toggleLoadingState fired')
    //this.loading = !this.loading
  }
  ngOnDestroy(){
  }



}
