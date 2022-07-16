import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap, scheduled,mergeAll,forkJoin, concatAll} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment';
import { ResPlan,Resource, IResPlan, IProject, IResource } from '../interfaces/res-plan-model';
import { UserStateService } from './userState.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceplannerService {

  constructor(private http: HttpClient,private _stateSvc:UserStateService) { }
  baseUrl = protectedResources.todoListApi.endpoint;

  public getResourcePlans(resUid:string, resName:string,
    fromDate:Date, toDate :Date, timescale:number, workscale:number): Observable<IResPlan> {
    var postData = {
      "resuid": resUid,
      "fromDate": fromDate,
      "toDate": toDate,
      "timeScale": timescale,
      "workScale": workscale
    };
    //TODO: Uncomment this when api is done
      return this.http.post<IResPlan>(environment.apiBaseUrl + "/ResourcePlanner/GetResourcePlans", postData).pipe
      (
        map(data=>{
          if(data){
          data.resource = new Resource(resUid,resName)
          return data;
          }
          else{
            return new ResPlan(new Resource(resUid,resName))
          }
        })
      )
      
    }

    public getResourcePlansForCurrentUser(fromDate:Date, toDate :Date, timescale:number, workscale:number) : Observable<IResPlan[]>{
      //get resources for current user as resource manager
      let resources$ = this._stateSvc.getWorkspaceResourcesForResourceManager();

      return resources$.pipe(
         //flatten an array of resources to call getResourcePlans on each resource
        mergeMap((resources)=>{
          debugger;
          return forkJoin(resources.map(resource=>{
            return this.getResourcePlans(resource.resUid,resource.resName, fromDate, toDate,timescale,workscale);
          }))
        })
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
           
        return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/addResourcePlan", postData)
           
      }

    public addResourcePlanForProjects(projects:IProject[], resource:IResource,
        fromDate:Date, toDate :Date, timescale:number, workscale:number)
        {
            return of(projects).pipe(
                mergeMap(projects=>{
                    return forkJoin(projects.map(project=>{
                      return this.addResourcePlan(project.projUid,project.projName,resource.resUid,fromDate,toDate,timescale,workscale)
                    }))
                })
            )
        }

      public updateResourcePlan(resPlan : ResPlan){
        return this.http.post<any>(environment.apiBaseUrl + "/ResourcePlanner/GetResourcePlans", resPlan)

      }
}