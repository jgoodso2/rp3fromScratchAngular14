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
          resource :{
            "resUid": "82866b88-7413-453c-acaa-a4d13103df40",
            "resName": "Donna Stephen",
          },
          projects :[
            {
              projUid: "553b4916-c5c0-ec11-81a5-0050568f11be",
              projName: "Project 1",
              intervals: [
                {
                    intervalName: "Interval0",
                    intervalValue: "5",
                    start : new Date(2022,1,7),
                    end : new Date(2022,1,8)
                },
                {
                  intervalName: "Interval1",
                  intervalValue: "6",
                  start : new Date(2022,1,8),
                  end : new Date(2022,1,9)
              }
            ],
          }]
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
