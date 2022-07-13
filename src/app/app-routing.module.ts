import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { HomeComponent } from './components/home/home.component';
import { TodoViewComponent } from './todo-view/todo-view.component';
import { TodoEditComponent } from './todo-edit/todo-edit.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { ResPlanHomeComponent } from './components/res-plan-home/res-plan-home.component';
import { ResPlanListComponent } from './components/res-plan-list/res-plan-list.component';
//import { DateRangePicker } from './common/dateRangePicker/dateRangePicker.component';
import { ResPlanEditGuardService } from './services/res-plan-edit-guard.service';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { ResourcePlansResolverService } from './services/resource-plans-resolver.service';
/**
 * MSAL Angular can protect routes in your application
 * using MsalGuard. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#secure-the-routes-in-your-application
 */

 const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ResPlanHomeComponent,  
     children: [
        { path: 'resPlans', component: ResPlanListComponent ,  
        resolve: {resPlans: ResourcePlansResolverService } ,
          //canDeactivate: [ResPlanEditGuardService],  
          //why did this break timesheet totals??
        
        },
        {
          path: 'user',
          component: UserinfoComponent,
          canActivate: [
            MsalGuard
          ]
        },
          
        { path: 'customDates', component: DateRangePickerComponent},
        { path: 'perview', redirectTo: "https://perview.app.parallon.com/pwa" ,pathMatch: 'full'},
        { path: '', redirectTo: 'resPlans', pathMatch: 'full' , canDeactivate: [ ResPlanEditGuardService ]},
      
      ]
}
]
const protectedRoutes: Routes = [
  {
    path: 'todo-edit/:id',
    component: TodoEditComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: 'todo-view',
    component: TodoViewComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    // Needed for hash routing
    path: 'error',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'state',
    component: HomeComponent
  },
  {
    // Needed for hash routing
    path: 'code',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'user',
    component: UserinfoComponent
  }
];

const isIframe = window !== window.parent && !window.opener;

//this was from the old code that worked.
// @NgModule({
//   imports: [RouterModule.forRoot(routes, {
//     useHash: true,
//     // Don't perform initial navigation in iframes
//     initialNavigation: !isIframe ? 'enabled' : 'disabled'
//   })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

