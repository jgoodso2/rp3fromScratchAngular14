import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable,mergeMap, map,of, tap } from 'rxjs';
import { IResPlan, ResPlan } from '../interfaces/res-plan-model';
import { AppStateService } from './app-state.service';
import { ResourceplannerService } from './resourceplanner.service';
import { UserStateService } from './userState.service';


@Injectable({
  providedIn: 'root'
})
export class ResourcePlansResolverService implements Resolve<IResPlan[]> {
  boo: any[]

  constructor(private _resPlanSvc: ResourceplannerService
    , private _resPlanUserStateSvc: UserStateService
    , private router: Router
    , private _appState: AppStateService
  
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResPlan[]> {
   console.log("====HEY...resolver fired with route = " + JSON.stringify(route.params)) 


    //set up the default parameters needed by res-plan-list component
    //let currentYear = new CurrentCalendarYear()
    //if find on route, use it
    let fromDate = route.params["fromDate"] && new Date(route.params["fromDate"]) || this._appState.queryParams.fromDate 
    let toDate = route.params["toDate"] && new Date(route.params["toDate"]) || this._appState.queryParams.toDate;
    let timescale = route.params["timescale"] || this._appState.queryParams.timescale;
    let workunits = route.params["workunits"] || this._appState.queryParams.workunits;
    workunits =1;
    let showTimesheetData:boolean;
    if(route.params["showTimesheetData"])
    {
      showTimesheetData =  route.params["showTimesheetData"] == "true";
    }
    else{
      showTimesheetData = this._appState.queryParams.showTimesheetData
    }
 
    this._appState.queryParams.fromDate = fromDate
    this._appState.queryParams.toDate = toDate
    this._appState.queryParams.timescale = timescale
    this._appState.queryParams.workunits = workunits 
    this._appState.queryParams.showTimesheetData = showTimesheetData
    return this._resPlanSvc.getResourcePlansForCurrentUser(fromDate,toDate,timescale,workunits).pipe(
      tap(data=>{debugger;console.log("RESPlans=" +data)})
    )
    //return this._resPlanUserStateSvc.getCurrentUserId().mergeMap((resMgr: any)=>{
    // return this._resPlanSvc.getResourcePlans("F9AC882F-4D97-E911-812B-0050568F11BE","zzz_Stephen RP Test Project"
    // ,"BF9AE494-8F72-EA11-B0CD-00155D8C8B3A",new Date(2022,7,10),new Date(2022,8,15),4,1).pipe(
    //   map((resPlans:IResPlan[]) => {
    //       console.log('Resplans from resolver: ')
    //       return resPlans
    //   })
    // )
    //})

  }
}
