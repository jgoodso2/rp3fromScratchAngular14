import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment'; 
import { FrameworkConfigService, FrameworkConfigSettings  } from '../fw/services/framework-config.service' ;
import  { MenuService } from '../fw/services/menu.service';
import { initialMenuItems  } from './app.menu';
import { AppStateService } from './services/app-state.service'; 



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean; 
  title = 'Microsoft identity platform';
  env  = environment.apiBaseUrl;
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    // private authService: MsalService,
    // private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private _appSvc: AppStateService,
    private _frameworkConfigService: FrameworkConfigService,
    private _menuService: MenuService
  ) {     _appSvc.loading$.subscribe(val => this.loading = val)
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

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => status === InteractionStatus.None),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(() => {
    //     this.setLoginDisplay();
    //   });
  }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // login() {
  //   if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
  //     if (this.msalGuardConfig.authRequest) {
  //       this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
  //         .subscribe((response: AuthenticationResult) => {
  //           this.authService.instance.setActiveAccount(response.account);
  //         });
  //     } else {
  //       this.authService.loginPopup()
  //         .subscribe((response: AuthenticationResult) => {
  //           this.authService.instance.setActiveAccount(response.account);
  //         });
  //     }
  //   } else {
  //     if (this.msalGuardConfig.authRequest) {
  //       this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
  //     } else {
  //       this.authService.loginRedirect();
  //     }
  //   }
  // }

  // logout() {
  //   this.authService.logout();
  // }

  // unsubscribe to events when component is destroyed
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
