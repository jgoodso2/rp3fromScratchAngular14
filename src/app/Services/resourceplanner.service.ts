import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceplannerService {

  constructor(private http: HttpClient) { }
  baseUrl = protectedResources.todoListApi.endpoint;

  public getResourcePlans(pid: string, projname:string, resUid:string, 
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
    
      return this.http.post<any>("https://localhost:7056/ResourcePlanner/GetResourcePlans", postData)
         
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
           
        return this.http.post<any>("https://localhost:7056/ResourcePlanner/AddResourcePlan", postData)
           
      }
}
