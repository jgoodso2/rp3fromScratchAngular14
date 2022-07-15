import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TodoEditComponent } from './todo-edit/todo-edit.component';
import { TodoViewComponent } from './todo-view/todo-view.component';
import { TodoService } from './services/todo.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';

import { msalConfig, loginRequest, protectedResources } from './auth-config';
import { UserStateService } from './services/userState.service';
import { ProjectService } from './services/project.service';
import { ResPlanEditGuardService } from './services/res-plan-edit-guard.service';
import { AppStateService } from './services/app-state.service';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { TimesheetService } from './services/timesheet.service.';
import { FwModule } from 'src/fw/fw.module';
import { ResPlanHomeComponent } from './components/res-plan-home/res-plan-home.component';
import { ResPlanListComponent } from './components/res-plan-list/res-plan-list.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { ResPlanHeaderRowComponent } from './components/res-plan-header-row/res-plan-header-row.component';
import { CollapsibleWellComponent } from './common/collapsible-well.component';
import { HeaderRowComponent } from './common/header-row.component';
import { CellWorkUnitsPipe } from './common/cell-work-units.pipe';
import { IntervalPipe } from './common/interval.pipe';
import { IntervalMaskDirective } from './directives/interval-mask.directive';
import { ProjectDateSpanDirective } from './directives/project-date-span.directive';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { SimpleModalComponent } from './common/simple-modal.component';
//

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
 * MSAL Angular will automatically retrieve tokens for resources 
 * added to protectedResourceMap. For more info, visit: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap.set(protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { 
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

@NgModule({
  declarations: [
    CollapsibleWellComponent,
    HeaderRowComponent,
    AppComponent,
    HomeComponent,
    TodoViewComponent,
    TodoEditComponent,
    UserinfoComponent,
    ResPlanHomeComponent,
    ResPlanListComponent,
    DateRangePickerComponent,
    ResPlanHeaderRowComponent,
    CellWorkUnitsPipe,
    IntervalPipe,
    IntervalMaskDirective,
    ProjectDateSpanDirective,
    ProjectListComponent,
    SimpleModalComponent,
    ProjectListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MsalModule,
    FwModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    TodoService,
    UserStateService,
    ProjectService,
    TimesheetService, 
    ResPlanEditGuardService,
    AppStateService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
