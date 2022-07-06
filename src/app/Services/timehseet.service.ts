import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { observable, Observable, of , from , map, switchMap, filter, find, tap,pluck, first, flatMap, mergeMap, toArray, concatMap} from 'rxjs';
import { protectedResources } from '../auth-config';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TimehseetService {

  constructor(private http: HttpClient) { }
  baseUrl = protectedResources.todoListApi.endpoint;
  
  public getTimesheetData(resUid: string, startDate:Date, endDate :Date): Observable<any> {
  var postData = {
    "resUid": resUid,
    "startDate": startDate,
    "endDate": endDate
  };
       
   return this.http.post<any>("https://localhost:7056/ResourcePlanner/GetTimesheets", postData)
       
  }
}
