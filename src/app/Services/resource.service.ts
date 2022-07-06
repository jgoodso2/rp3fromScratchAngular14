import { Injectable } from '@angular/core';
import { Resource } from '../Interfaces/res-plan-model';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  //TODO: do we need this in all services?
  baseUrl = protectedResources.todoListApi.endpoint;

  constructor(private http: HttpClient) { }
  getResources() : Observable<Resource[]>
  {
    return this.http.get<Resource[]>(environment.apiBaseUrl + "/ResourcePlanner/GetResources")
    .pipe(
     map((response:any)=>{
      return response.map((data:any)=>{
      var resource = new Resource(data.ResourceId,data.Name);
       resource.timesheetMgr = data["TimesheetManagerId"];
       return resource;
      })
    })
     )
  }

  getResource(resUid:string) : Observable<Resource>{
    return this.http.get<Resource[]>(environment.apiBaseUrl + "/ResourcePlanner/GetResource?resourceId=" + resUid)
    .pipe(
     map((response:any)=>{
      return response.map((data:any)=>{
      var resource = new Resource(data.ResourceId,data.Name);
       resource.timesheetMgr = data["TimesheetManagerId"];
       return resource;
      })
    })
     )

  }
}
