import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap, scheduled,mergeAll,forkJoin} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment';
import { ResPlan,Resource, IResPlan } from '../interfaces/res-plan-model';
import { UserStateService } from './userState.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceplannerService {

  constructor(private http: HttpClient,private _stateSvc:UserStateService) { }
  baseUrl = protectedResources.todoListApi.endpoint;

  public getResourcePlans(resUid:string, 
    fromDate:Date, toDate :Date, timescale:number, workscale:number): Observable<IResPlan> {
    var postData = {
      "resuid": resUid,
      "fromDate": fromDate,
      "toDate": toDate,
      "timeScale": timescale,
      "workScale": workscale
    };
    //TODO: Uncomment this when api is done
      //return this.http.post<IResPlan>(environment.apiBaseUrl + "/ResourcePlanner/GetResourcePlans", postData)
      return of(
        {
          resource:{
            resUid: "6aca6c84-71b3-e711-8102-0050568f1156",
          resName: "Donna Stephen"
          },
          projects: [
              {
                  projName: "Project 1",
                  projUid: "3203d426-1c09-4663-84e6-bedea7dba3a4",
                  readOnly: false,
                  readOnlyReason: "",
                  intervals: [
                      {
                          intervalName: "Interval0",
                          intervalValue: "0.5",
                          start: new Date( "7/1/2022"),
                          end: new Date( "8/1/2022")
                      },
                      {
                          intervalName: "Interval1",
                          intervalValue: "04",
                          start: new Date( "8/1/2022"),
                          end: new Date( "9/1/2022")
                      },
                      {
                          intervalName: "Interval2",
                          intervalValue: "4",
                          start: new Date( "9/1/2022"),
                          end: new Date( "10/1/2022")
                      },
                      {
                          intervalName: "Interval3",
                          intervalValue: "4",
                          start: new Date( "10/1/2022"),
                          end: new Date( "11/1/2022")
                      },
                      {
                          intervalName: "Interval4",
                          intervalValue: "4",
                          start: new Date( "11/1/2022"),
                          end: new Date( "12/1/2022")
                      }
                  ],
                  timesheetData: [
                      {
                          intervalName: "Interval0",
                          intervalValue: "4",
                          start: new Date( "7/1/2022"),
                          end: new Date( "8/1/2022")
                      },
                      {
                          intervalName: "Interval1",
                          intervalValue: "4",
                          start: new Date( "8/1/2022"),
                          end: new Date( "9/1/2022")
                      },
                      {
                          intervalName: "Interval2",
                          intervalValue: "4",
                          start: new Date( "9/1/2022"),
                          end: new Date( "10/1/2022")
                      },
                      {
                          intervalName: "Interval3",
                          intervalValue: "4",
                          start: new Date( "10/1/2022"),
                          end: new Date( "11/1/2022")
                      },
                      {
                          intervalName: "Interval4",
                          intervalValue: "4",
                          start: new Date( "11/1/2022"),
                          end: new Date( "12/1/2022")
                      }
                  ]
              },
              {
                  projName: "Project 2",
                  projUid: "3203d426-1c09-4663-84e6-bedea7dba3a4",
                  readOnly: false,
                  readOnlyReason: "",
                  intervals: [
                      {
                          intervalName: "Interval0",
                          intervalValue: "2",
                          start: new Date( "7/1/2022"),
                          end: new Date( "8/1/2022")
                      },
                      {
                          intervalName: "Interval1",
                          intervalValue: "99",
                          start: new Date( "8/1/2022"),
                          end: new Date( "9/1/2022")
                      },
                      {
                          intervalName: "Interval2",
                          intervalValue: "33",
                          start: new Date( "9/1/2022"),
                          end: new Date( "10/1/2022")
                      },
                      {
                          intervalName: "Interval3",
                          intervalValue: "4",
                          start: new Date( "10/1/2022"),
                          end: new Date( "11/1/2022")
                      },
                      {
                          intervalName: "Interval4",
                          intervalValue: "4",
                          start: new Date( "11/1/2022"),
                          end: new Date( "12/1/2022")
                      }
                  ],
                  timesheetData: [
                      {
                          intervalName: "Interval0",
                          intervalValue: "0",
                          start: new Date( "7/1/2022"),
                          end: new Date( "8/1/2022")
                      },
                      {
                          intervalName: "Interval1",
                          intervalValue: "20",
                          start: new Date( "8/1/2022"),
                          end: new Date( "9/1/2022")
                      },
                      {
                          intervalName: "Interval2",
                          intervalValue: "20",
                          start: new Date( "9/1/2022"),
                          end: new Date( "10/1/2022")
                      },
                      {
                          intervalName: "Interval3",
                          intervalValue: "20",
                          start: new Date( "10/1/2022"),
                          end: new Date( "11/1/2022")
                      },
                      {
                          intervalName: "Interval4",
                          intervalValue: "26",
                          start: new Date( "11/1/2022"),
                          end: new Date( "12/1/2022")
                      }
                  ]
              }
          ]
      }
      ) 
    }

    public getResourcePlansForCurrentUser(fromDate:Date, toDate :Date, timescale:number, workscale:number) : Observable<ResPlan[]>{
      //get resources for current user as resource manager
      let resources$ = this._stateSvc.getWorkspaceResourcesForResourceManager();

      return resources$.pipe(
         //flatten an array of resources to call getResourcePlans on each resource
        mergeMap((resources)=>{
          debugger;
          return forkJoin(resources.map(resource=>{
            return this.getResourcePlans(resource.resUid, fromDate, toDate,timescale,workscale);
          }))
        }),
        
      )
      
    }


    public addResourcePlan(pid: string, projname:string, resUid:string, 
      fromDate:Date, toDate :Date, timescale:number, workscale:number): Observable<any> {
      var postData = {
        "puid": pid,
        "projname": projname,
        "resuid": resUid,
        "fromDate": fromDate,
        "toDate": toDate,
        "timeScale": timescale,
        "workScale": workscale
      };
           
        return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/GetResourcePlans", postData)
           
      }

      public updateResourcePlan(resPlan : ResPlan){
        return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/GetResourcePlans", resPlan)

      }
}
